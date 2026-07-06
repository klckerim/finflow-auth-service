using MediatR;

public class BulkCategorizeTransactionsHandler : IRequestHandler<BulkCategorizeTransactionsCommand, int>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly ITransactionCategorizationService _categorizationService;

    public BulkCategorizeTransactionsHandler(
        ITransactionRepository transactionRepository,
        ITransactionCategorizationService categorizationService)
    {
        _transactionRepository = transactionRepository;
        _categorizationService = categorizationService;
    }

    public async Task<int> Handle(BulkCategorizeTransactionsCommand request, CancellationToken cancellationToken)
    {
        var transactions = await _transactionRepository.GetUncategorizedTransactionsByUserIdAsync(request.UserId, cancellationToken);

        if (transactions.Count == 0)
        {
            return 0;
        }

        await Parallel.ForEachAsync(
            transactions,
            new ParallelOptions { MaxDegreeOfParallelism = 4, CancellationToken = cancellationToken },
            async (transaction, ct) =>
            {
                var category = await _categorizationService.CategorizeAsync(transaction.Description, transaction.Amount, transaction.Type, ct);
                await _transactionRepository.UpdateCategoryAsync(transaction.Id, category, ct);
            });

        return transactions.Count;
    }
}
