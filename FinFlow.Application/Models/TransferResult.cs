public enum TransferStatus
{
    Success,
    SourceWalletNotFound,
    RecipientWalletNotFound,
    InsufficientBalance,
    CurrencyMismatch
}

public sealed record TransferResult(TransferStatus Status, string? Currency = null);