using FinFlow.Domain.Entities;
using FinFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class WalletRepository : IWalletRepository
{
    private readonly IDbContextFactory<FinFlowDbContext> _contextFactory;

    public WalletRepository(IDbContextFactory<FinFlowDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task AddAsync(Wallet wallet)
    {
        var context = _contextFactory.CreateDbContext();
        await context.Wallets.AddAsync(wallet);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Wallet wallet)
    {
        var context = _contextFactory.CreateDbContext();
        context.Wallets.Remove(wallet);
        await context.SaveChangesAsync();
    }

    public async Task<Wallet?> GetByIdAsync(Guid walletId, CancellationToken cancellationToken)
    {
        var context = _contextFactory.CreateDbContext();
        return await context.Wallets
            .Include(w => w.Transactions)
            .FirstOrDefaultAsync(w => w.Id == walletId, cancellationToken);
    }


    public async Task<List<Wallet>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        var context = _contextFactory.CreateDbContext();
        return await context.Wallets
            .Where(w => w.UserId == userId)
            .Include(w => w.Transactions)
            .ToListAsync(cancellationToken: cancellationToken);
    }


    public async Task UpdateAsync(Wallet wallet)
    {
        var context = _contextFactory.CreateDbContext();
        context.Wallets.Update(wallet);
        await context.SaveChangesAsync();
    }

    // one context, one commit
    public async Task<bool> IncreaseBalanceWithTransactionAsync(Guid walletId, decimal amount, CancellationToken ct)
    {
        await using var db = await _contextFactory.CreateDbContextAsync(ct);
        await using var transaction = await db.Database.BeginTransactionAsync(ct);

        try
        {
            var wallet = await db.Wallets
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(w => w.Id == walletId, ct);

            if (wallet == null)
            {
                return false;
            }

            wallet.Balance += amount;

            db.Transactions.Add(new Transaction
            {
                WalletId = walletId,
                Amount = amount,
                Type = TransactionType.Deposit,
                Description = "Money has been deposited."
            });

            await db.SaveChangesAsync(ct);
            await transaction.CommitAsync();

            return true;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
