using FinFlow.Domain.Entities;

public interface IWalletRepository
{
    Task<Wallet?> GetByIdAsync(Guid walletId, CancellationToken cancellationToken);
    Task<List<Wallet>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(Wallet wallet);
    Task UpdateAsync(Wallet wallet);
    Task DeleteAsync(Wallet wallet);
    Task<bool> IncreaseBalanceWithTransactionAsync(Guid walletId, decimal amount, string? idempotencyKey, CancellationToken cancellationToken);
    Task<Guid> DecreaseBalanceWithTransactionAsync(Guid walletId, decimal amount, string description, string? idempotencyKey, CancellationToken cancellationToken);
    Task<bool> TransferWithTransactionsAsync(Guid fromWalletId, Guid toWalletId, decimal amount, string? idempotencyKey, CancellationToken cancellationToken);
}
