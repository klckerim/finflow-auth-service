using FinFlow.Domain.Entities;
using FinFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class WalletRepository : IWalletRepository
{
    private readonly FinFlowDbContext _dbContext;

    public WalletRepository(FinFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Wallet wallet)
    {
        await _dbContext.Wallets.AddAsync(wallet);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Wallet wallet)
    {
        _dbContext.Wallets.Remove(wallet);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Wallet?> GetByIdAsync(Guid walletId, CancellationToken cancellationToken)
    {
        return await _dbContext.Wallets
            .Include(w => w.Transactions)
            .FirstOrDefaultAsync(w => w.Id == walletId, cancellationToken);
    }


    public async Task<List<Wallet>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Wallets
            .Where(w => w.UserId == userId)
            .Include(w => w.Transactions)
            .ToListAsync(cancellationToken: cancellationToken);
    }


    public async Task UpdateAsync(Wallet wallet)
    {
        _dbContext.Wallets.Update(wallet);
        await _dbContext.SaveChangesAsync();
    }
}
