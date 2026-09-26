using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace FinFlow.Tests;

public class FallbackTransactionCategorizationServiceTests
{
    private const string Description = "Migros market";
    private const decimal Amount = 245.90m;
    private const TransactionType Type = TransactionType.BillPayment;

    private readonly IAiProvider _primary = Substitute.For<IAiProvider>();
    private readonly IAiProvider _fallback = Substitute.For<IAiProvider>();
    private readonly FallbackTransactionCategorizationService _service;

    public FallbackTransactionCategorizationServiceTests()
    {
        _primary.Name.Returns("Primary");
        _fallback.Name.Returns("Fallback");
        _service = new FallbackTransactionCategorizationService(
            _primary, _fallback, NullLogger<FallbackTransactionCategorizationService>.Instance);
    }

    [Fact]
    public async Task CategorizeAsync_ShouldReturnPrimaryResult_AndNotCallFallback_WhenPrimarySucceeds()
    {
        _primary.CategorizeAsync(Description, Amount, Type, Arg.Any<CancellationToken>())
            .Returns(TransactionCategory.Groceries);

        var category = await _service.CategorizeAsync(Description, Amount, Type);

        Assert.Equal(TransactionCategory.Groceries, category);
        await _fallback.DidNotReceiveWithAnyArgs().CategorizeAsync(default, default, default, default);
    }

    [Fact]
    public async Task CategorizeAsync_ShouldUseFallback_WhenPrimaryIsUnavailable()
    {
        _primary.CategorizeAsync(Description, Amount, Type, Arg.Any<CancellationToken>())
            .ThrowsAsync(new AiProviderUnavailableException("Primary", "rate_limited"));
        _fallback.CategorizeAsync(Description, Amount, Type, Arg.Any<CancellationToken>())
            .Returns(TransactionCategory.Groceries);

        var category = await _service.CategorizeAsync(Description, Amount, Type);

        Assert.Equal(TransactionCategory.Groceries, category);
    }

    [Fact]
    public async Task CategorizeAsync_ShouldUseFallback_WhenPrimaryThrowsUnexpectedException()
    {
        // A provider that breaks its contract (bare exception instead of AiProviderUnavailableException)
        // must still not take categorization down.
        _primary.CategorizeAsync(Description, Amount, Type, Arg.Any<CancellationToken>())
            .ThrowsAsync(new InvalidOperationException("provider bug"));
        _fallback.CategorizeAsync(Description, Amount, Type, Arg.Any<CancellationToken>())
            .Returns(TransactionCategory.Bills);

        var category = await _service.CategorizeAsync(Description, Amount, Type);

        Assert.Equal(TransactionCategory.Bills, category);
    }

    [Fact]
    public async Task CategorizeAsync_ShouldReturnOther_AndNotThrow_WhenBothProvidersFail()
    {
        _primary.CategorizeAsync(Description, Amount, Type, Arg.Any<CancellationToken>())
            .ThrowsAsync(new AiProviderUnavailableException("Primary", "timeout"));
        _fallback.CategorizeAsync(Description, Amount, Type, Arg.Any<CancellationToken>())
            .ThrowsAsync(new AiProviderUnavailableException("Fallback", "server_error"));

        var category = await _service.CategorizeAsync(Description, Amount, Type);

        Assert.Equal(TransactionCategory.Other, category);
    }

    [Fact]
    public async Task CategorizeAsync_ShouldPassSameInputsAndTokenToBothProviders()
    {
        using var cts = new CancellationTokenSource();
        _primary.CategorizeAsync(default, default, default, default)
            .ThrowsAsyncForAnyArgs(new AiProviderUnavailableException("Primary", "timeout"));
        _fallback.CategorizeAsync(default, default, default, default)
            .ReturnsForAnyArgs(TransactionCategory.Dining);

        await _service.CategorizeAsync(Description, Amount, Type, cts.Token);

        await _primary.Received(1).CategorizeAsync(Description, Amount, Type, cts.Token);
        await _fallback.Received(1).CategorizeAsync(Description, Amount, Type, cts.Token);
    }
}
