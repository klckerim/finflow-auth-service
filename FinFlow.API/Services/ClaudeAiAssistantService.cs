using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using MediatR;

/// <summary>
/// Answers questions about the caller's own wallets/transactions using the Anthropic Messages API
/// with tool calling. Tool execution is always scoped to the server-side <c>userId</c> passed in by
/// the controller (resolved from the JWT) — any id the model produces in a tool call is ignored, so
/// the assistant can never read another user's financial data.
/// </summary>
public class ClaudeAiAssistantService : IAiAssistantService
{
    private const int MaxToolRounds = 4;

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly IMediator _mediator;
    private readonly ILogger<ClaudeAiAssistantService> _logger;

    public ClaudeAiAssistantService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        IMediator mediator,
        ILogger<ClaudeAiAssistantService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _mediator = mediator;
        _logger = logger;
    }

    public async Task<string> AskAsync(Guid userId, string message, IReadOnlyList<ChatMessageDto> history, CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Anthropic:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return "AI assistant is not configured. Please set Anthropic:ApiKey.";
        }

        var messages = new JsonArray();
        foreach (var entry in history)
        {
            messages.Add(new JsonObject { ["role"] = entry.Role, ["content"] = entry.Content });
        }
        messages.Add(new JsonObject { ["role"] = "user", ["content"] = message });

        var client = _httpClientFactory.CreateClient("Anthropic");

        // Built once and mutated in place: a JsonNode can only have one parent, so re-assigning the
        // same `messages` array into a brand new JsonObject on every loop iteration would throw.
        var requestBody = new JsonObject
        {
            ["model"] = _configuration["Anthropic:AssistantModel"] ?? "claude-sonnet-5",
            ["max_tokens"] = 1024,
            ["system"] = "You are FinFlow's financial assistant. Answer only using data returned by tools. Be concise and reply in the language the user used.",
            ["messages"] = messages,
            ["tools"] = BuildToolDefinitions()
        };

        for (var round = 0; round < MaxToolRounds; round++)
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(20));

            HttpResponseMessage response;
            try
            {
                response = await client.PostAsJsonAsync("v1/messages", requestBody, cts.Token);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Anthropic assistant call failed.");
                return "Sorry, I couldn't reach the AI assistant right now.";
            }

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Anthropic assistant call failed with status {Status}.", response.StatusCode);
                return "Sorry, I couldn't reach the AI assistant right now.";
            }

            var json = await response.Content.ReadFromJsonAsync<JsonNode>(cancellationToken: cts.Token);
            var contentBlocks = json?["content"]?.AsArray() ?? new JsonArray();

            var toolUses = contentBlocks
                .Where(block => block?["type"]?.GetValue<string>() == "tool_use")
                .ToList();

            if (toolUses.Count == 0)
            {
                var text = string.Concat(contentBlocks
                    .Where(block => block?["type"]?.GetValue<string>() == "text")
                    .Select(block => block!["text"]!.GetValue<string>()));

                return string.IsNullOrWhiteSpace(text) ? "I couldn't come up with an answer." : text;
            }

            // Echo the assistant's tool-use turn back, then supply the tool results, before asking again.
            messages.Add(new JsonObject { ["role"] = "assistant", ["content"] = JsonNode.Parse(contentBlocks.ToJsonString()) });

            var toolResults = new JsonArray();
            foreach (var toolUse in toolUses)
            {
                var toolName = toolUse!["name"]!.GetValue<string>();
                var toolUseId = toolUse["id"]!.GetValue<string>();

                var result = await ExecuteToolAsync(userId, toolName, toolUse["input"], cancellationToken);

                toolResults.Add(new JsonObject
                {
                    ["type"] = "tool_result",
                    ["tool_use_id"] = toolUseId,
                    ["content"] = result
                });
            }

            messages.Add(new JsonObject { ["role"] = "user", ["content"] = toolResults });
        }

        return "I wasn't able to finish answering within the allowed number of tool calls.";
    }

    private async Task<string> ExecuteToolAsync(Guid userId, string toolName, JsonNode? input, CancellationToken cancellationToken)
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
                    var limit = input?["limit"]?.GetValue<int>() ?? 20;
                    var walletIdRaw = input?["walletId"]?.GetValue<string>();

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
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Assistant tool {Tool} failed.", toolName);
            return "Tool execution failed.";
        }
    }

    private static JsonArray BuildToolDefinitions()
    {
        return new JsonArray
        {
            new JsonObject
            {
                ["name"] = "get_wallets",
                ["description"] = "Returns the caller's own wallets with id, name, balance and currency.",
                ["input_schema"] = new JsonObject
                {
                    ["type"] = "object",
                    ["properties"] = new JsonObject()
                }
            },
            new JsonObject
            {
                ["name"] = "get_recent_transactions",
                ["description"] = "Returns the caller's own recent transactions, optionally filtered to one wallet.",
                ["input_schema"] = new JsonObject
                {
                    ["type"] = "object",
                    ["properties"] = new JsonObject
                    {
                        ["walletId"] = new JsonObject { ["type"] = "string", ["description"] = "Optional wallet id (GUID) to filter by." },
                        ["limit"] = new JsonObject { ["type"] = "integer", ["description"] = "Max number of transactions to return (default 20)." }
                    }
                }
            }
        };
    }
}
