public interface IStripePaymentService
{
    Task<(bool Succeeded, string? PaymentIntentId)> ConfirmPaymentAsync(string stripeCustomerId, string paymentMethodId, decimal amount, string currency);

    Task<(bool Succeeded, string? StripeCustomerId)> CreateStripeCustomer(string email);
}
