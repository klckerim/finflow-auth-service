namespace FinFlow.Domain.Entities;



/// Wallet entity representing a user's wallet.
public class Wallet
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public User User { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Currency { get; set; } = "TRY";

    public decimal Balance { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}