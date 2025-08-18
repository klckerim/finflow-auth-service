using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using MediatR;
using Stripe;
using Newtonsoft.Json;
using FinFlow.Domain.Entities;


[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PaymentsController> _logger;
    private readonly IConfiguration _config;

    private readonly IWalletRepository _walletRepository;
    private readonly ITransactionRepository _transactionRepository;
    public PaymentsController(ILogger<PaymentsController> logger, IMediator mediator, IWalletRepository walletRepository, ITransactionRepository transactionRepository, IConfiguration config)
    {
        _logger = logger;
        _config = config;
        _mediator = mediator;
        _walletRepository = walletRepository;
        _transactionRepository = transactionRepository;
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

            // Metadata kontrolü
            if (session.Metadata != null && session.Metadata.TryGetValue("walletId", out var walletIdStr))
            {
                if (Guid.TryParse(walletIdStr, out var walletGuid))
                {
                    var wallet = await _walletRepository.GetByIdAsync(walletGuid, CancellationToken.None);
                    if (wallet != null)
                    {
                        var amount = session.AmountTotal.HasValue ? session.AmountTotal.Value / 100m : 0m;
                        wallet.Balance += amount;
                        await _walletRepository.UpdateAsync(wallet);

                        var transaction = new Transaction
                        {
                            WalletId = walletGuid,
                            Amount = amount,
                            Type = TransactionType.Deposit,
                            Description = "Money has been deposited into the wallet."
                        };
                        
                        await _transactionRepository.AddAsync(transaction, CancellationToken.None);

                        _logger.LogInformation("Wallet {WalletId} balance updated with {Amount}. TestMode={TestMode}", walletIdStr, amount, !session.Livemode);
                    }
                    else
                    {
                        _logger.LogError("Wallet not found: {WalletId}. TestMode={TestMode}", walletIdStr, !session.Livemode);
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
