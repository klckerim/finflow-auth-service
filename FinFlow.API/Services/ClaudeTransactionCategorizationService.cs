using System.Net.Http.Json;
using System.Text.Json.Nodes;

/// <summary>
/// Classifies transactions into a <see cref="TransactionCategory"/> using the Anthropic Messages API,
/// forcing a tool call so the model can only return one of the known category values (structured output).
/// </summary>
public class ClaudeTransactionCategorizationService : ITransactionCategorizationService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ClaudeTransactionCategorizationService> _logger;

    public ClaudeTransactionCategorizationService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<ClaudeTransactionCategorizationService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    // Must never throw: categorization is best-effort and must not block money movement.
    public async Task<TransactionCategory> CategorizeAsync(string? description, decimal amount, TransactionType type, CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Anthropic:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogWarning("Anthropic:ApiKey is not configured; skipping AI categorization.");
            return TransactionCategory.Other;
        }

        try
        {
            var categoryNames = Enum.GetNames<TransactionCategory>();

            var requestBody = new JsonObject
            {
                ["model"] = _configuration["Anthropic:CategorizationModel"] ?? "claude-haiku-4-5-20251001",
                ["max_tokens"] = 200,
                ["messages"] = new JsonArray
                {
                    new JsonObject
                    {
                        ["role"] = "user",
                        ["content"] = $"Transaction type: {type}. Amount: {amount}. Description: \"{description ?? "(none)"}\". Classify this personal-finance transaction."
                    }
                },
                ["tool_choice"] = new JsonObject { ["type"] = "tool", ["name"] = "categorize_transaction" },
                ["tools"] = new JsonArray
                {
                    new JsonObject
                    {
                        ["name"] = "categorize_transaction",
                        ["description"] = "Assigns a spending category to a transaction.",
                        ["input_schema"] = new JsonObject
                        {
                            ["type"] = "object",
                            ["properties"] = new JsonObject
                            {
                                ["category"] = new JsonObject
                                {
                                    ["type"] = "string",
                                    ["enum"] = new JsonArray(categoryNames.Select(name => (JsonNode)name!).ToArray())
                                }
                            },
                            ["required"] = new JsonArray("category")
                        }
                    }
                }
            };

            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(5));

            var client = _httpClientFactory.CreateClient("Anthropic");
            using var response = await client.PostAsJsonAsync("v1/messages", requestBody, cts.Token);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Anthropic categorization call failed with status {Status}.", response.StatusCode);
                return TransactionCategory.Other;
            }

            var json = await response.Content.ReadFromJsonAsync<JsonNode>(cancellationToken: cts.Token);
            var contentBlocks = json?["content"]?.AsArray() ?? new JsonArray();
            var toolUse = contentBlocks.FirstOrDefault(block => block?["type"]?.GetValue<string>() == "tool_use");

            var categoryValue = toolUse?["input"]?["category"]?.GetValue<string>();

            if (categoryValue != null && Enum.TryParse<TransactionCategory>(categoryValue, ignoreCase: true, out var category))
            {
                return category;
            }

            return TransactionCategory.Other;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "AI transaction categorization failed; defaulting to Other.");
            return TransactionCategory.Other;
        }
    }
}
