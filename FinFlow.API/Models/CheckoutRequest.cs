public class CheckoutRequest
{
    public string? WalletId { get; set; }
    public decimal Amount { get; set; }
    public string? Currency { get; set; } = "usd";
}