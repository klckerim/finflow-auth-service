/// Classifies a transaction into a spending category using an LLM.
/// Implementations must never throw: categorization is best-effort and must not block money movement.
public interface ITransactionCategorizationService
{
    Task<TransactionCategory> CategorizeAsync(string? description, decimal amount, TransactionType type, CancellationToken cancellationToken = default);
}
