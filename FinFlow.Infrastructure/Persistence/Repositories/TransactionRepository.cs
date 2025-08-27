using FinFlow.Domain.Entities;
using FinFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class TransactionRepository : ITransactionRepository
{
    private readonly IDbContextFactory<FinFlowDbContext> _contextFactory;

    public TransactionRepository(IDbContextFactory<FinFlowDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default)
    {
        var context = _contextFactory.CreateDbContext();

        await context.Transactions.AddAsync(transaction, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Transaction>> GetTransactionsByUserIdAsync(Guid userId, int limit = 20, CancellationToken cancellationToken = default)
    {
        var context = _contextFactory.CreateDbContext();

        return await context.Transactions
            .Include(t => t.Wallet)
            .Include(t => t.PaymentMethod)
            .Where(t => (t.Wallet != null && t.Wallet.UserId == userId) ||
                        (t.PaymentMethod != null && t.PaymentMethod.UserId == userId))
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<Transaction>> GetTransactionsByWalletIdAsync(Guid walletId, int limit = 20, CancellationToken cancellationToken = default)
    {
        var context = _contextFactory.CreateDbContext();

        return await context.Transactions
            .Where(t => t.WalletId == walletId)
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<Transaction>> GetByWalletIdAsync(Guid walletId, CancellationToken cancellationToken = default)
    {
        var context = _contextFactory.CreateDbContext();

        return await context.Transactions
            .Where(t => t.WalletId == walletId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Transaction>> GetTransactionsByCardIdAsync(Guid paymentMethodId, int limit = 20, CancellationToken cancellationToken = default)
    {
        var context = _contextFactory.CreateDbContext();

        return await context.Transactions
            .Where(t => t.PaymentMethodId == paymentMethodId)
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }
}
