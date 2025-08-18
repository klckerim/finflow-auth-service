using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using MediatR;
using Stripe;
using Newtonsoft.Json;


[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PaymentsController> _logger;
    private readonly IConfiguration _config;

    private readonly IWalletRepository _walletRepository;

    public PaymentsController(ILogger<PaymentsController> logger, IMediator mediator, IWalletRepository walletRepository, IConfiguration config)
    {
        _logger = logger;
        _config = config;
        _mediator = mediator;
        _walletRepository = walletRepository;
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


        var stripeEvent = EventUtility.ConstructEvent(
            json,
            Request.Headers["Stripe-Signature"],
            secret
        );

        _logger.LogInformation("Received Stripe webhook event: {EventType}", stripeEvent.Type);

        if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
        {
            // Güvenli cast
            var session = stripeEvent.Data.Object as Session;

            if (session == null)
            {
                _logger.LogError("Session is null in webhook event.");
                return BadRequest("Invalid session data.");
            }

            if (session.Metadata != null && session.Metadata.TryGetValue("walletId", out var walletId))
            {
                var amount = session.AmountTotal.HasValue ? session.AmountTotal.Value / 100m : 0m;

                var walletGuid = Guid.Parse(walletId);
                var wallet = await _walletRepository.GetByIdAsync(walletGuid, new CancellationToken());

                if (wallet != null)
                {
                    wallet.Balance += amount;
                    await _walletRepository.UpdateAsync(wallet);
                    _logger.LogInformation("Wallet {WalletId} balance updated with {Amount}", walletId, amount);
                }
                else
                {
                    _logger.LogError("Wallet not found: {WalletId}", walletId);
                }
            }
            else
            {
                _logger.LogError("No walletId found in session metadata.");
                return BadRequest("No walletId found in session metadata.");
            }

            _logger.LogInformation("Checkout session processed successfully.");
        }

        return Ok();
    }
}
