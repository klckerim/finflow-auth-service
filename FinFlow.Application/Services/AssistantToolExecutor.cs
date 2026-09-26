using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Logging;

public class AssistantToolExecutor : IAssistantToolExecutor
{
    private readonly IMediator _mediator;
    private readonly ILogger<AssistantToolExecutor> _logger;

    public AssistantToolExecutor(IMediator mediator, ILogger<AssistantToolExecutor> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public IReadOnlyList<AssistantToolDefinition> GetToolDefinitions() =>
    [
        new AssistantToolDefinition(
            "get_wallets",
            "Returns the caller's own wallets with id, name, balance and currency.",
            new Dictionary<string, AssistantToolParameter>(),
            Array.Empty<string>()),
        new AssistantToolDefinition(
            "get_recent_transactions",
            "Returns the caller's own recent transactions, optionally filtered to one wallet.",
            new Dictionary<string, AssistantToolParameter>
            {
                ["walletId"] = new("string", "Optional wallet id (GUID) to filter by."),
                ["limit"] = new("integer", "Max number of transactions to return (default 20).")
            },
            Array.Empty<string>())
    ];

    public async Task<AssistantToolResult> ExecuteAsync(Guid userId, string toolName, IReadOnlyDictionary<string, string?> arguments, CancellationToken cancellationToken = default)
    {
        try
        {
            switch (toolName)
            {
                case "get_wallets":
                {
                    var wallets = await _mediator.Send(new GetWalletsByUserIdQuery(userId), cancellationToken);
                    return AssistantToolResult.Success(JsonSerializer.Serialize(wallets));
                }
                case "get_recent_transactions":
                {
                    var limit = arguments.TryGetValue("limit", out var limitRaw) && int.TryParse(limitRaw, out var parsedLimit)
                        ? parsedLimit
                        : 20;
                    var walletIdRaw = arguments.TryGetValue("walletId", out var w) ? w : null;

                    if (!string.IsNullOrWhiteSpace(walletIdRaw))
                    {
                        if (!Guid.TryParse(walletIdRaw, out var walletId))
                        {
                            return AssistantToolResult.Error($"Invalid walletId '{walletIdRaw}': expected a wallet id (GUID) as returned by get_wallets.");
                        }

                        // walletId comes from the model, so it is untrusted input: only query it if the
                        // wallet belongs to the JWT user. Same message for "missing" and "not yours" so the
                        // tool can't be used to probe other users' wallet ids.
                        var ownWallets = await _mediator.Send(new GetWalletsByUserIdQuery(userId), cancellationToken);
                        if (!ownWallets.Any(wallet => wallet.Id == walletId))
                        {
                            return AssistantToolResult.Error($"Wallet '{walletId}' was not found among the user's wallets. Use get_wallets to list valid wallet ids.");
                        }

                        var walletTransactions = await _mediator.Send(new GetTransactionsByWalletIdQuery(walletId, limit), cancellationToken);
                        return AssistantToolResult.Success(JsonSerializer.Serialize(walletTransactions));
                    }

                    var transactions = await _mediator.Send(new GetTransactionsByUserIdQuery(userId, limit), cancellationToken);
                    return AssistantToolResult.Success(JsonSerializer.Serialize(transactions));
                }
                default:
                    return AssistantToolResult.Error($"Unknown tool '{toolName}'.");
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Assistant tool {ToolName} failed.", toolName);
            return AssistantToolResult.Error(AssistantToolExecutorExtensions.InternalErrorMessage(toolName));
        }
    }
}
