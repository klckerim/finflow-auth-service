using System.Text.Json;
using MediatR;

public class AssistantToolExecutor : IAssistantToolExecutor
{
    private readonly IMediator _mediator;

    public AssistantToolExecutor(IMediator mediator)
    {
        _mediator = mediator;
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

    public async Task<string> ExecuteAsync(Guid userId, string toolName, IReadOnlyDictionary<string, string?> arguments, CancellationToken cancellationToken = default)
    {
        try
        {
            switch (toolName)
            {
                case "get_wallets":
                {
                    var wallets = await _mediator.Send(new GetWalletsByUserIdQuery(userId), cancellationToken);
                    return JsonSerializer.Serialize(wallets);
                }
                case "get_recent_transactions":
                {
                    var limit = arguments.TryGetValue("limit", out var limitRaw) && int.TryParse(limitRaw, out var parsedLimit)
                        ? parsedLimit
                        : 20;
                    var walletIdRaw = arguments.TryGetValue("walletId", out var w) ? w : null;

                    if (!string.IsNullOrWhiteSpace(walletIdRaw) && Guid.TryParse(walletIdRaw, out var walletId))
                    {
                        var walletTransactions = await _mediator.Send(new GetTransactionsByWalletIdQuery(walletId, limit), cancellationToken);
                        return JsonSerializer.Serialize(walletTransactions);
                    }

                    var transactions = await _mediator.Send(new GetTransactionsByUserIdQuery(userId, limit), cancellationToken);
                    return JsonSerializer.Serialize(transactions);
                }
                default:
                    return "Unknown tool.";
            }
        }
        catch (Exception)
        {
            return "Tool execution failed.";
        }
    }
}
