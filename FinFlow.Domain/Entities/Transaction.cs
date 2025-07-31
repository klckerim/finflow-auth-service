namespace FinFlow.Domain.Entities;

/// Transaction entity representing a financial transaction in a wallet.
public class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid WalletId { get; set; }

    public required Wallet Wallet { get; set; }

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
