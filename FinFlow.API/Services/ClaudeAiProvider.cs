using System.Text.Json;
using Anthropic;
using Anthropic.Exceptions;
using Anthropic.Models.Messages;

/// <summary>
/// <see cref="IAiProvider"/> implementation backed by Anthropic's Claude Messages API via the
/// official Anthropic SDK. Configured as the fallback provider — Gemini is primary. Structured
/// output for categorization uses a forced tool call; the assistant uses standard multi-turn
/// tool calling against <see cref="IAssistantToolExecutor"/>.
/// Any failure (timeout, rate limit, server error, empty/unusable response) is translated into
/// <see cref="AiProviderUnavailableException"/> so the fallback orchestrator can react uniformly.
/// </summary>
public class ClaudeAiProvider : IAiProvider
{
    private const int MaxToolRounds = 4;

    private readonly AnthropicClient _client;
    private readonly IConfiguration _configuration;
    private readonly IAssistantToolExecutor _toolExecutor;
    private readonly ILogger<ClaudeAiProvider> _logger;

    public string Name => "Anthropic";

    public ClaudeAiProvider(
        AnthropicClient client,
        IConfiguration configuration,
        IAssistantToolExecutor toolExecutor,
        ILogger<ClaudeAiProvider> logger)
    {
        _client = client;
        _configuration = configuration;
        _toolExecutor = toolExecutor;
        _logger = logger;
    }

    public async Task<TransactionCategory> CategorizeAsync(string? description, decimal amount, TransactionType type, CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Anthropic:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new AiProviderUnavailableException(Name, "not_configured");
        }

        try
        {
            var categoryNames = Enum.GetNames<TransactionCategory>();

            var tool = new Tool
            {
                Name = "categorize_transaction",
                Description = "Assigns a spending category to a transaction.",
                InputSchema = new()
                {
                    Properties = new Dictionary<string, JsonElement>
                    {
                        ["category"] = JsonSerializer.SerializeToElement(new { type = "string", @enum = categoryNames })
                    },
                    Required = ["category"]
                }
            };

            var response = await _client.Messages.Create(new MessageCreateParams
            {
                Model = _configuration["Anthropic:CategorizationModel"] ?? "claude-haiku-4-5-20251001",
                MaxTokens = 200,
                Thinking = new ThinkingConfigDisabled(),
                ToolChoice = new ToolChoiceTool { Name = "categorize_transaction" },
                Tools = [tool],
                Messages =
                [
                    new()
                    {
                        Role = Role.User,
                        Content = $"Transaction type: {type}. Amount: {amount}. Description: \"{description ?? "(none)"}\". Classify this personal-finance transaction."
                    }
                ]
            }).WaitAsync(cancellationToken);

            foreach (var block in response.Content)
            {
                if (block.TryPickToolUse(out ToolUseBlock? toolUse) && toolUse is not null
                    && toolUse.Input.TryGetValue("category", out var categoryElement))
                {
                    var categoryValue = categoryElement.GetString();
                    if (categoryValue != null && Enum.TryParse<TransactionCategory>(categoryValue, ignoreCase: true, out var category))
                    {
                        return category;
                    }
                }
            }

            throw new AiProviderUnavailableException(Name, "empty_or_invalid_response");
        }
        catch (AiProviderUnavailableException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new AiProviderUnavailableException(Name, ClassifyFailure(ex), ex);
        }
    }

    public async Task<string> AskAsync(Guid userId, string message, IReadOnlyList<ChatMessageDto> history, CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Anthropic:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new AiProviderUnavailableException(Name, "not_configured");
        }

        try
        {
            var messages = new List<MessageParam>();
            foreach (var entry in history)
            {
                messages.Add(new MessageParam
                {
                    Role = string.Equals(entry.Role, "assistant", StringComparison.OrdinalIgnoreCase) ? Role.Assistant : Role.User,
                    Content = entry.Content
                });
            }
            messages.Add(new MessageParam { Role = Role.User, Content = message });

            var tools = _toolExecutor.GetToolDefinitions().Select(ToClaudeTool).Select(t => (ToolUnion)t).ToList();

            for (var round = 0; round < MaxToolRounds; round++)
            {
                var response = await _client.Messages.Create(new MessageCreateParams
                {
                    Model = _configuration["Anthropic:AssistantModel"] ?? "claude-sonnet-5",
                    MaxTokens = 1024,
                    Thinking = new ThinkingConfigDisabled(),
                    System = "You are FinFlow's financial assistant. Answer only using data returned by tools. Be concise and reply in the language the user used.",
                    Tools = tools,
                    Messages = messages
                }).WaitAsync(cancellationToken);

                var toolUses = new List<ToolUseBlock>();
                var textParts = new List<string>();

                foreach (var block in response.Content)
                {
                    if (block.TryPickToolUse(out ToolUseBlock? toolUse) && toolUse is not null)
                    {
                        toolUses.Add(toolUse);
                    }
                    else if (block.TryPickText(out TextBlock? text) && text is not null)
                    {
                        textParts.Add(text.Text);
                    }
                }

                if (toolUses.Count == 0)
                {
                    var answer = string.Concat(textParts);
                    if (string.IsNullOrWhiteSpace(answer))
                    {
                        throw new AiProviderUnavailableException(Name, "empty_response");
                    }
                    return answer;
                }

                // Echo the assistant's tool-use turn back, then supply the tool results, before asking again.
                var assistantContent = new List<ContentBlockParam>();
                foreach (var block in response.Content)
                {
                    if (block.TryPickText(out TextBlock? text) && text is not null)
                    {
                        assistantContent.Add(new TextBlockParam { Text = text.Text });
                    }
                    else if (block.TryPickToolUse(out ToolUseBlock? toolUse) && toolUse is not null)
                    {
                        assistantContent.Add(new ToolUseBlockParam { ID = toolUse.ID, Name = toolUse.Name, Input = toolUse.Input });
                    }
                }
                messages.Add(new MessageParam { Role = Role.Assistant, Content = assistantContent });

                var toolResults = new List<ContentBlockParam>();
                foreach (var toolUse in toolUses)
                {
                    var arguments = toolUse.Input.ToDictionary(kv => kv.Key, kv => (string?)JsonElementToString(kv.Value));
                    var result = await _toolExecutor.ExecuteAsync(userId, toolUse.Name, arguments, cancellationToken);
                    toolResults.Add(new ToolResultBlockParam { ToolUseID = toolUse.ID, Content = result });
                }
                messages.Add(new MessageParam { Role = Role.User, Content = toolResults });
            }

            throw new AiProviderUnavailableException(Name, "tool_round_limit_exceeded");
        }
        catch (AiProviderUnavailableException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new AiProviderUnavailableException(Name, ClassifyFailure(ex), ex);
        }
    }

    private static Tool ToClaudeTool(AssistantToolDefinition definition)
    {
        var properties = new Dictionary<string, JsonElement>();
        foreach (var (paramName, param) in definition.Parameters)
        {
            properties[paramName] = JsonSerializer.SerializeToElement(new { type = param.Type, description = param.Description });
        }

        return new Tool
        {
            Name = definition.Name,
            Description = definition.Description,
            InputSchema = new()
            {
                Properties = properties,
                Required = definition.Required.ToList()
            }
        };
    }

    private static string? JsonElementToString(JsonElement element) => element.ValueKind switch
    {
        JsonValueKind.String => element.GetString(),
        JsonValueKind.Null or JsonValueKind.Undefined => null,
        _ => element.GetRawText()
    };

    // Timeout/429/5xx are the fallback triggers called out explicitly; anything else is still
    // wrapped (as "unexpected_error") so a genuinely broken primary call doesn't take the whole
    // categorization/assistant flow down with it.
    private string ClassifyFailure(Exception ex)
    {
        var reason = ex switch
        {
            AnthropicRateLimitException => "rate_limited",
            Anthropic5xxException => "server_error",
            AnthropicIOException => "timeout",
            OperationCanceledException => "timeout",
            _ => "unexpected_error"
        };

        _logger.LogWarning(ex, "Anthropic call failed ({Reason}).", reason);
        return reason;
    }
}
