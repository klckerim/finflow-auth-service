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
    public async Task<bool> IncreaseBalanceWithTransactionAsync(Guid walletId, decimal amount, string? idempotencyKey, CancellationToken ct)
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
                Description = "Money has been deposited.",
                IdempotencyKey = idempotencyKey
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

    public async Task<Guid> DecreaseBalanceWithTransactionAsync(Guid walletId, decimal amount, string description, string? idempotencyKey, CancellationToken ct)
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
                throw new AppException(ErrorCodes.WalletNotFound, "Wallet not found.", 404);
            }

            if (wallet.Balance < amount)
            {
                throw new AppException(ErrorCodes.InsufficientBalance, "Insufficient wallet balance.");
            }

            wallet.Balance -= amount;

            var transactionEntry = new Transaction
            {
                WalletId = walletId,
                Amount = amount,
                Type = TransactionType.BillPayment,
                Description = description,
                IdempotencyKey = idempotencyKey
            };

            db.Transactions.Add(transactionEntry);

            await db.SaveChangesAsync(ct);
            await transaction.CommitAsync();

            return transactionEntry.Id;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> TransferWithTransactionsAsync(Guid fromWalletId, Guid toWalletId, decimal amount, string? idempotencyKey, CancellationToken ct)
    {
        await using var db = await _contextFactory.CreateDbContextAsync(ct);
        await using var transaction = await db.Database.BeginTransactionAsync(ct);

        try
        {
            if (!string.IsNullOrWhiteSpace(idempotencyKey))
            {
                var existing = await db.Transactions
                    .FirstOrDefaultAsync(t => t.IdempotencyKey == idempotencyKey && t.Type == TransactionType.TransferOut, ct);
                if (existing != null)
                {
                    return true;
                }
            }

            var fromWallet = await db.Wallets
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(w => w.Id == fromWalletId, ct);
            if (fromWallet == null)
            {
                throw new AppException(ErrorCodes.SourceWalletNotFound, "Source wallet not found.", 404);
            }

            var toWallet = await db.Wallets
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(w => w.Id == toWalletId, ct);
            if (toWallet == null)
            {
                throw new AppException(ErrorCodes.RecipientWalletNotFound, "Recipient wallet not found.", 404);
            }

            if (fromWallet.Balance < amount)
            {
                throw new AppException(ErrorCodes.InsufficientBalance, "Insufficient balance.");
            }

            if (!string.Equals(fromWallet.Currency, toWallet.Currency, StringComparison.OrdinalIgnoreCase))
            {
                throw new AppException(ErrorCodes.RecipientWalletCurrency, "", 400, new Dictionary<string, object> { { "Currency", fromWallet.Currency } });
            }

            fromWallet.Balance -= amount;
            toWallet.Balance += amount;

            db.Transactions.AddRange(
                new Transaction
                {
                    WalletId = fromWallet.Id,
                    Amount = -amount,
                    Type = TransactionType.TransferOut,
                    Description = $"Transfer to wallet {toWallet.Name}",
                    IdempotencyKey = idempotencyKey
                },
                new Transaction
                {
                    WalletId = toWallet.Id,
                    Amount = amount,
                    Type = TransactionType.TransferIn,
                    Description = $"Transfer from wallet {fromWallet.Name}",
                    IdempotencyKey = idempotencyKey
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