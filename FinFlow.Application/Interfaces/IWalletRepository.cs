using FinFlow.Domain.Entities;

public interface IWalletRepository
{
    Task<Wallet?> GetByIdAsync(Guid walletId, CancellationToken cancellationToken);
    Task<List<Wallet>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(Wallet wallet);
    Task UpdateAsync(Wallet wallet);
    Task DeleteAsync(Wallet wallet);
    Task<bool> IncreaseBalanceWithTransactionAsync(Guid walletId, decimal amount, CancellationToken cancellationToken);
}
