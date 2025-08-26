namespace FinFlow.Domain.Entities;

public class PaymentMethod
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public User User { get; set; } = default!;

    public string StripePaymentMethodId { get; set; } = default!;

    public string Brand { get; set; } = string.Empty;

    public string Last4 { get; set; } = string.Empty;

    public long ExpMonth { get; set; }

    public long ExpYear { get; set; }

    public string? CardHolderName { get; set; }

    public bool IsDefault { get; set; } = false;

    public bool IsActive { get; set; } = true;

    public string? ExternalReference { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

