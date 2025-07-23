using FinFlow.Domain.Entities;

public interface IWalletRepository
{
    Task<Wallet?> GetByIdAsync(Guid walletId);
    Task<List<Wallet>> GetByUserIdAsync(Guid userId);
    Task AddAsync(Wallet wallet);
    Task UpdateAsync(Wallet wallet);
    Task DeleteAsync(Wallet wallet);

}
