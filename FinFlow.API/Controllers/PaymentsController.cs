using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using MediatR;
using Stripe;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PaymentsController> _logger;
    private readonly IConfiguration _config;

    public PaymentsController(ILogger<PaymentsController> logger, IMediator mediator, IConfiguration config)
    {
        _logger = logger;
        _config = config;
        _mediator = mediator;
    }


    [HttpPost("bill")]
    public async Task<IActionResult> PayBill([FromBody] PayBillRequest request)
    {
        var paymentId = await _mediator.Send(new PayBillCommand(
            request.Email,
            request.Amount,
            request.WalletId,
            request.CardId,
            request.Currency,
            $"Bill {request.BillId}",
            request.PaymentType
        ));

        return Ok(new { PaymentId = paymentId });
    }

    [HttpPost("create-setup-session")]
    public IActionResult CreateSetupSession([FromBody] CreateSetupRequest request)
    {
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            Mode = "setup",
            SuccessUrl = _config["Stripe:SuccessUrl"],
            CancelUrl = _config["Stripe:CancelUrl"],
            Metadata = new Dictionary<string, string>
        {
            { "userId", request.UserId.ToString() }
        }
        };

        if (!string.IsNullOrEmpty(request.CustomerEmail))
            options.CustomerEmail = request.CustomerEmail;

        var service = new SessionService();
        var session = service.Create(options);

        if (session == null)
        {
            _logger.LogError("Failed to create Stripe setup session.");
            return BadRequest("Failed to create setup session.");
        }

        _logger.LogInformation("Stripe setup session created: {SessionId}", session.Id);
        return Ok(new { sessionId = session.Id, url = session.Url });
    }


    [HttpPost("create-session")]
    public IActionResult CreateCheckoutSession([FromBody] CheckoutRequest request)
    {
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = request.Currency,
                        UnitAmount = (long)(request.Amount * 100), // Stripe cent cinsinden ,
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Add Money to Wallet",
                        }
                    },
                    Quantity = 1
                }
            },
            Mode = "payment",
            SuccessUrl = _config["Stripe:SuccessUrl"],
            CancelUrl = _config["Stripe:CancelUrl"],
            Metadata = new Dictionary<string, string>
            {
                { "walletId", request.WalletId ?? Guid.Empty.ToString() },
                { "amount", request.Amount.ToString() },
                { "currency", request.Currency ?? "usd" }
            },
            PaymentIntentData = new SessionPaymentIntentDataOptions
            {
                Metadata = new Dictionary<string, string>
            {
                { "walletId", request.WalletId ?? Guid.Empty.ToString() },
                { "amount", request.Amount.ToString() },
                { "currency", request.Currency ?? "usd" }
            }
            }
        };

        var service = new SessionService();
        var session = service.Create(options);
        if (session == null)
        {
            _logger.LogError("Failed to create Stripe session.");
            return BadRequest("Failed to create payment session.");
        }
        _logger.LogInformation("Stripe session created successfully: {SessionId}", session.Id);

        return Ok(new { sessionId = session.Id });
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {

        // Yeni scope 
        using (var scope = HttpContext.RequestServices.CreateScope())
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var secret = _config["Stripe:WebhookSecret"];

            Stripe.Event stripeEvent;
            try
            {
                stripeEvent = Stripe.EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    secret
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Invalid Stripe webhook signature.");
                return BadRequest();
            }

            _logger.LogInformation("Received Stripe webhook event: {EventType}", stripeEvent.Type);

            // Checkout Session Completed
            if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                if (session == null)
                {
                    _logger.LogError("Session is null in webhook event.");
                    return BadRequest("Invalid session data.");
                }


                if (session.Mode == "setup" || (session.Metadata != null && session.Metadata.ContainsKey("userId")))
                {
                    try
                    {
                        var setupIntentId = session.SetupIntentId;
                        if (!string.IsNullOrEmpty(setupIntentId))
                        {
                            var setupService = new SetupIntentService();
                            var setupIntent = await setupService.GetAsync(setupIntentId);

                            var paymentMethodId = setupIntent?.PaymentMethodId ?? setupIntent?.PaymentMethod.Id;

                            if (!string.IsNullOrEmpty(paymentMethodId))
                            {
                                var pmService = new PaymentMethodService();
                                var pm = await pmService.GetAsync(paymentMethodId);

                                if (session.Metadata != null && session.Metadata.TryGetValue("userId", out var userIdStr)
                                    && Guid.TryParse(userIdStr, out var userGuid))
                                {
                                    var card = pm.Card;
                                    var saveCmd = new SavePaymentMethodCommand(
                                        userGuid,
                                        paymentMethodId,
                                        card?.Brand ?? string.Empty,
                                        card?.Last4 ?? string.Empty,
                                        card?.ExpMonth ?? 0,
                                        card?.ExpYear ?? 0,
                                        pm.BillingDetails?.Name
                                    );

                                    var saved = await _mediator.Send(saveCmd);
                                    if (saved)
                                    {
                                        _logger.LogInformation("Saved payment method {PM} for user {UserId}", paymentMethodId, userGuid);
                                    }
                                }
                                else
                                {
                                    _logger.LogWarning("No userId metadata found on setup session {SessionId}", session.Id);
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to process setup session.");
                    }
                }

                else if (session.Mode == "payment" && session.Metadata != null && session.Metadata.TryGetValue("walletId", out var walletIdStr))
                {
                    if (Guid.TryParse(walletIdStr, out var walletGuid))
                    {
                        var amount = session.AmountTotal.HasValue ? session.AmountTotal.Value / 100m : 0m;

                        var result = await _mediator.Send(new DepositCommand(walletGuid, amount));
                        if (result)
                        {
                            _logger.LogInformation("Wallet {WalletId} balance updated with {Amount}. TestMode={TestMode}", walletIdStr, amount, !session.Livemode);
                        }
                        else
                        {
                            _logger.LogError("Wallet not found or failed to update: {WalletId}. TestMode={TestMode}", walletIdStr, !session.Livemode);
                        }
                    }
                    else
                    {
                        _logger.LogError("Invalid walletId format: {WalletId}", walletIdStr);
                    }
                }
                else
                {
                    _logger.LogError("No walletId found in session metadata. TestMode={TestMode}", !session.Livemode);
                }

                _logger.LogInformation("Checkout session processed successfully. TestMode={TestMode}", !session.Livemode);
            }

            if (stripeEvent.Type == EventTypes.ChargeSucceeded)
            {
                var charge = stripeEvent.Data.Object as Stripe.Charge;
                _logger.LogInformation("Charge succeeded: {ChargeId}, Amount: {Amount}, TestMode={TestMode}",
                    charge?.Id, charge?.Amount, !charge?.Livemode);
            }

            return Ok();
        }

    }
}
