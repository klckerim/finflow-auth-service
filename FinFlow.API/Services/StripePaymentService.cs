using Stripe;

public class StripePaymentService : IStripePaymentService
{

    private readonly ILogger<StripePaymentService> _logger;

    public StripePaymentService(ILogger<StripePaymentService> logger)
    {
        _logger = logger;
    }


    public async Task<(bool Succeeded, string? PaymentIntentId)> ConfirmPaymentAsync(string stripeCustomerId, string paymentMethodId, decimal amount, string currency)
    {
        var paymentMethodService = new PaymentMethodService();
        await paymentMethodService.AttachAsync(
            paymentMethodId,
            new PaymentMethodAttachOptions
            {
                Customer = stripeCustomerId
            }
        );

        var options = new PaymentIntentCreateOptions
        {
            Amount = (long)(amount * 100),
            Currency = currency ?? "usd",
            Customer = stripeCustomerId,
            PaymentMethod = paymentMethodId,
            Confirm = true,
            PaymentMethodTypes = new List<string> { "card" }
        };

        var service = new PaymentIntentService();
        var paymentIntent = await service.CreateAsync(options);
        return (paymentIntent.Status == "succeeded", paymentIntent.Id);

    }

    public async Task<(bool Succeeded, string? StripeCustomerId)> CreateStripeCustomer(string email)
    {
        try
        {
            var customerService = new CustomerService();
            var customer = await customerService.CreateAsync(new CustomerCreateOptions
            {
                Email = email
            });

            return (true, customer.Id);
        }
        catch
        {
            _logger.LogError("Stripe Customer Could Not Be Created.");
        }

        return (false, "");
    }
}


