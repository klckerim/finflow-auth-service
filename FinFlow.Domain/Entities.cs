namespace FinFlow.Domain.Entities;

///User entity representing a user in the system.
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.User;

    public UserStatus Status { get; set; } = UserStatus.Active;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Wallet> Wallets { get; set; } = new List<Wallet>();
}

/// Wallet entity representing a user's wallet.
public class Wallet
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public User User { get; set; }

    public string Currency { get; set; } = "TRY";

    public decimal Balance { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}

/// Transaction entity representing a financial transaction in a wallet.
/// Contains properties for transaction identification, amount, type, description, and creation date.
/// Each transaction is linked to a wallet and can be of different types (Deposit, Withdraw, Transfer).
public class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid WalletId { get; set; }

    public Wallet Wallet { get; set; }

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// Enum representing different types of transactions.
public enum TransactionType
{
    Deposit,
    Withdraw,
    Transfer
}

/// Enum representing different user roles.
public enum UserRole
{
    User,
    Admin
}

/// Enum representing different user statuses.
public enum UserStatus
{
    Active,
    Inactive,
    Banned
}
