using FinFlow.Domain.Entities;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default);
    Task<Transaction?> GetByIdempotencyKeyAsync(string idempotencyKey, TransactionType type, CancellationToken cancellationToken = default);
    Task<List<Transaction>> GetByWalletIdAsync(Guid walletId, CancellationToken cancellationToken = default);
    Task<List<Transaction>> GetTransactionsByUserIdAsync(Guid userId, int limit = 20, CancellationToken cancellationToken = default);
    Task<List<Transaction>> GetTransactionsByWalletIdAsync(Guid walletId, int limit = 20, CancellationToken cancellationToken = default);
    Task<List<Transaction>> GetTransactionsByCardIdAsync(Guid paymentMethodId, int limit = 20,  CancellationToken cancellationToken = default);
}
