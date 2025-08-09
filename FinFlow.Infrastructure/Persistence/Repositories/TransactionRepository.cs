using FinFlow.Domain.Entities;
using FinFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class TransactionRepository : ITransactionRepository
{
    private readonly FinFlowDbContext _context;

    public TransactionRepository(FinFlowDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default)
    {
        await _context.Transactions.AddAsync(transaction, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Transaction>> GetTransactionsByUserIdAsync(Guid userId, int limit = 20, CancellationToken cancellationToken = default)
    {
        return await _context.Transactions
            .Include(t => t.Wallet)
            .Where(t => t.Wallet != null && t.Wallet.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<Transaction>> GetTransactionsByWalletIdAsync(Guid walletId, int limit = 20, CancellationToken cancellationToken = default)
    {
        return await _context.Transactions
            .Where(t => t.WalletId == walletId)
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<Transaction>> GetByWalletIdAsync(Guid walletId, CancellationToken cancellationToken = default)
    {
        return await _context.Transactions
            .Where(t => t.WalletId == walletId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
