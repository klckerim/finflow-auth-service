using MediatR;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace FinFlow.Tests;

public class AssistantToolExecutorTests
{
    private static readonly IReadOnlyDictionary<string, string?> NoArguments = new Dictionary<string, string?>();

    private readonly IMediator _mediator = Substitute.For<IMediator>();
    private readonly AssistantToolExecutor _executor;

    public AssistantToolExecutorTests()
    {
        _executor = new AssistantToolExecutor(_mediator, NullLogger<AssistantToolExecutor>.Instance);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnSuccess_WhenQuerySucceeds()
    {
        _mediator.Send(Arg.Any<GetWalletsByUserIdQuery>(), Arg.Any<CancellationToken>())
            .Returns(new List<WalletDto>());

        var result = await _executor.ExecuteAsync(Guid.NewGuid(), "get_wallets", NoArguments);

        Assert.False(result.IsError);
        Assert.Equal("[]", result.Content);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnErrorResult_WhenQueryThrows()
    {
        _mediator.Send(Arg.Any<GetWalletsByUserIdQuery>(), Arg.Any<CancellationToken>())
            .ThrowsAsync(new InvalidOperationException("db connection string leaked here"));

        var result = await _executor.ExecuteAsync(Guid.NewGuid(), "get_wallets", NoArguments);

        Assert.True(result.IsError);
        Assert.Contains("get_wallets", result.Content);
        Assert.DoesNotContain("connection string", result.Content);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnErrorResult_ForUnknownTool()
    {
        var result = await _executor.ExecuteAsync(Guid.NewGuid(), "delete_everything", NoArguments);

        Assert.True(result.IsError);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnErrorResult_ForInvalidWalletId()
    {
        var arguments = new Dictionary<string, string?> { ["walletId"] = "not-a-guid" };

        var result = await _executor.ExecuteAsync(Guid.NewGuid(), "get_recent_transactions", arguments);

        Assert.True(result.IsError);
        await _mediator.DidNotReceiveWithAnyArgs().Send(default(GetTransactionsByUserIdQuery)!, default);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnErrorResult_AndNotQueryWallet_WhenWalletBelongsToAnotherUser()
    {
        var userId = Guid.NewGuid();
        var otherUsersWalletId = Guid.NewGuid();
        _mediator.Send(new GetWalletsByUserIdQuery(userId), Arg.Any<CancellationToken>())
            .Returns(new List<WalletDto> { new() { Id = Guid.NewGuid() } });
        var arguments = new Dictionary<string, string?> { ["walletId"] = otherUsersWalletId.ToString() };

        var result = await _executor.ExecuteAsync(userId, "get_recent_transactions", arguments);

        Assert.True(result.IsError);
        await _mediator.DidNotReceive().Send(Arg.Any<GetTransactionsByWalletIdQuery>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnWalletTransactions_WhenWalletBelongsToUser()
    {
        var userId = Guid.NewGuid();
        var walletId = Guid.NewGuid();
        _mediator.Send(new GetWalletsByUserIdQuery(userId), Arg.Any<CancellationToken>())
            .Returns(new List<WalletDto> { new() { Id = walletId } });
        _mediator.Send(new GetTransactionsByWalletIdQuery(walletId, 5), Arg.Any<CancellationToken>())
            .Returns(new List<TransactionDto>());
        var arguments = new Dictionary<string, string?> { ["walletId"] = walletId.ToString(), ["limit"] = "5" };

        var result = await _executor.ExecuteAsync(userId, "get_recent_transactions", arguments);

        Assert.False(result.IsError);
        await _mediator.Received(1).Send(new GetTransactionsByWalletIdQuery(walletId, 5), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task ExecuteAsync_ShouldPropagateCallerCancellation()
    {
        using var cts = new CancellationTokenSource();
        cts.Cancel();
        _mediator.Send(Arg.Any<GetWalletsByUserIdQuery>(), Arg.Any<CancellationToken>())
            .ThrowsAsync(new OperationCanceledException(cts.Token));

        await Assert.ThrowsAnyAsync<OperationCanceledException>(
            () => _executor.ExecuteAsync(Guid.NewGuid(), "get_wallets", NoArguments, cts.Token));
    }

    [Fact]
    public async Task ExecuteSafelyAsync_ShouldConvertThrowingExecutorIntoErrorResult()
    {
        var throwingExecutor = Substitute.For<IAssistantToolExecutor>();
        throwingExecutor.ExecuteAsync(default, default!, default!, default).ReturnsForAnyArgs<Task<AssistantToolResult>>(
            _ => throw new InvalidOperationException("boom"));

        var result = await throwingExecutor.ExecuteSafelyAsync(Guid.NewGuid(), "get_wallets", NoArguments, NullLogger.Instance);

        Assert.True(result.IsError);
    }

    [Fact]
    public async Task ExecuteSafelyAsync_ShouldPropagateCallerCancellation()
    {
        using var cts = new CancellationTokenSource();
        cts.Cancel();
        var executor = Substitute.For<IAssistantToolExecutor>();
        executor.ExecuteAsync(default, default!, default!, default).ReturnsForAnyArgs<Task<AssistantToolResult>>(
            _ => throw new OperationCanceledException(cts.Token));

        await Assert.ThrowsAnyAsync<OperationCanceledException>(
            () => executor.ExecuteSafelyAsync(Guid.NewGuid(), "get_wallets", NoArguments, NullLogger.Instance, cts.Token));
    }
}
