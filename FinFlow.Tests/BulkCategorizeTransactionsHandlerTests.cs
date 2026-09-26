using FinFlow.Domain.Entities;
using NSubstitute;

namespace FinFlow.Tests;

public class BulkCategorizeTransactionsHandlerTests
{
    private readonly ITransactionRepository _repository = Substitute.For<ITransactionRepository>();
    private readonly ITransactionCategorizationService _categorization = Substitute.For<ITransactionCategorizationService>();
    private readonly BulkCategorizeTransactionsHandler _handler;

    public BulkCategorizeTransactionsHandlerTests()
    {
        _handler = new BulkCategorizeTransactionsHandler(_repository, _categorization);
    }

    [Fact]
    public async Task Handle_ShouldReturnZero_AndNotCallAi_WhenNothingIsUncategorized()
    {
        var userId = Guid.NewGuid();
        _repository.GetUncategorizedTransactionsByUserIdAsync(userId, Arg.Any<CancellationToken>())
            .Returns(new List<Transaction>());

        var count = await _handler.Handle(new BulkCategorizeTransactionsCommand(userId), CancellationToken.None);

        Assert.Equal(0, count);
        await _categorization.DidNotReceiveWithAnyArgs().CategorizeAsync(default, default, default, default);
        await _repository.DidNotReceiveWithAnyArgs().UpdateCategoryAsync(default, default, default);
    }

    [Fact]
    public async Task Handle_ShouldCategorizeAndPersistEveryTransaction()
    {
        var userId = Guid.NewGuid();
        var groceries = new Transaction { Description = "Migros", Amount = 120m, Type = TransactionType.BillPayment };
        var transport = new Transaction { Description = "İstanbulkart", Amount = 40m, Type = TransactionType.Payment };
        var unknown = new Transaction { Description = null, Amount = 15m, Type = TransactionType.Payment };

        _repository.GetUncategorizedTransactionsByUserIdAsync(userId, Arg.Any<CancellationToken>())
            .Returns(new List<Transaction> { groceries, transport, unknown });
        _categorization.CategorizeAsync("Migros", 120m, TransactionType.BillPayment, Arg.Any<CancellationToken>())
            .Returns(TransactionCategory.Groceries);
        _categorization.CategorizeAsync("İstanbulkart", 40m, TransactionType.Payment, Arg.Any<CancellationToken>())
            .Returns(TransactionCategory.Transport);
        // Degraded path: the categorization service returns Other when every provider fails.
        _categorization.CategorizeAsync(null, 15m, TransactionType.Payment, Arg.Any<CancellationToken>())
            .Returns(TransactionCategory.Other);

        var count = await _handler.Handle(new BulkCategorizeTransactionsCommand(userId), CancellationToken.None);

        Assert.Equal(3, count);
        await _repository.Received(1).UpdateCategoryAsync(groceries.Id, TransactionCategory.Groceries, Arg.Any<CancellationToken>());
        await _repository.Received(1).UpdateCategoryAsync(transport.Id, TransactionCategory.Transport, Arg.Any<CancellationToken>());
        await _repository.Received(1).UpdateCategoryAsync(unknown.Id, TransactionCategory.Other, Arg.Any<CancellationToken>());
    }
}
