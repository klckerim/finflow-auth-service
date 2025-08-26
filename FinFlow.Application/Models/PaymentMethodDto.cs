
public class PaymentMethodDto
{
    public Guid Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Last4 { get; set; } = string.Empty;
    public string? CardHolderName { get; set; }
    public long ExpMonth { get; set; }
    public long ExpYear { get; set; }
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string StripePaymentMethodId { get; set; } = default!;
}
