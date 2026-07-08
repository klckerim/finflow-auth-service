using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;

/// <summary>
/// <see cref="IAiProvider"/> implementation backed by the Google Generative Language API
/// (Gemini) via raw HTTP — there is no official first-party Google .NET SDK equivalent to
/// Anthropic's, so this talks to `POST /v1beta/models/{model}:generateContent` directly.
/// Configured as the primary provider; Claude is the fallback.
/// Wire shape (contents/parts/functionCall/functionResponse, uppercase Schema `type` values,
/// `key=` query-string auth) is per Google's public API discovery document.
/// </summary>
public class GeminiAiProvider : IAiProvider
{
    private const int MaxToolRounds = 4;

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly IAssistantToolExecutor _toolExecutor;
    private readonly ILogger<GeminiAiProvider> _logger;

    public string Name => "Gemini";

    public GeminiAiProvider(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        IAssistantToolExecutor toolExecutor,
        ILogger<GeminiAiProvider> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _toolExecutor = toolExecutor;
        _logger = logger;
    }

    public async Task<TransactionCategory> CategorizeAsync(string? description, decimal amount, TransactionType type, CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new AiProviderUnavailableException(Name, "not_configured");
        }

        try
        {
            var categoryNames = Enum.GetNames<TransactionCategory>();
            var model = _configuration["Gemini:CategorizationModel"] ?? "gemini-2.5-flash";

            var requestBody = new JsonObject
            {
                ["contents"] = new JsonArray
                {
                    new JsonObject
                    {
                        ["role"] = "user",
                        ["parts"] = new JsonArray
                        {
                            new JsonObject
                            {
                                ["text"] = $"Transaction type: {type}. Amount: {amount}. Description: \"{description ?? "(none)"}\". Classify this personal-finance transaction."
                            }
                        }
                    }
                },
                ["tools"] = new JsonArray
                {
                    new JsonObject
                    {
                        ["functionDeclarations"] = new JsonArray
                        {
                            new JsonObject
                            {
                                ["name"] = "categorize_transaction",
                                ["description"] = "Assigns a spending category to a transaction.",
                                ["parameters"] = new JsonObject
                                {
                                    ["type"] = "OBJECT",
                                    ["properties"] = new JsonObject
                                    {
                                        ["category"] = new JsonObject
                                        {
                                            ["type"] = "STRING",
                                            ["enum"] = new JsonArray(categoryNames.Select(name => (JsonNode)name!).ToArray())
                                        }
                                    },
                                    ["required"] = new JsonArray("category")
                                }
                            }
                        }
                    }
                },
                ["toolConfig"] = new JsonObject
                {
                    ["functionCallingConfig"] = new JsonObject
                    {
                        ["mode"] = "ANY",
                        ["allowedFunctionNames"] = new JsonArray("categorize_transaction")
                    }
                },
                ["generationConfig"] = new JsonObject { ["maxOutputTokens"] = 200 }
            };

            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(5));

            var client = _httpClientFactory.CreateClient("Gemini");
            using var response = await client.PostAsJsonAsync(
                $"v1beta/models/{model}:generateContent?key={Uri.EscapeDataString(apiKey)}", requestBody, cts.Token);

            if (!response.IsSuccessStatusCode)
            {
                throw new AiProviderUnavailableException(Name, ClassifyHttpStatus(response.StatusCode));
            }

            var json = await response.Content.ReadFromJsonAsync<JsonNode>(cancellationToken: cts.Token);
            var parts = json?["candidates"]?[0]?["content"]?["parts"]?.AsArray() ?? new JsonArray();

            foreach (var part in parts)
            {
                var functionCall = part?["functionCall"];
                if (functionCall is null)
                {
                    continue;
                }

                var categoryValue = functionCall["args"]?["category"]?.GetValue<string>();
                if (categoryValue != null && Enum.TryParse<TransactionCategory>(categoryValue, ignoreCase: true, out var category))
                {
                    return category;
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
        var apiKey = _configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new AiProviderUnavailableException(Name, "not_configured");
        }

        try
        {
            var model = _configuration["Gemini:AssistantModel"] ?? "gemini-2.5-flash";
            var client = _httpClientFactory.CreateClient("Gemini");

            var contents = new JsonArray();
            foreach (var entry in history)
            {
                contents.Add(new JsonObject
                {
                    ["role"] = string.Equals(entry.Role, "assistant", StringComparison.OrdinalIgnoreCase) ? "model" : "user",
                    ["parts"] = new JsonArray { new JsonObject { ["text"] = entry.Content } }
                });
            }
            contents.Add(new JsonObject
            {
                ["role"] = "user",
                ["parts"] = new JsonArray { new JsonObject { ["text"] = message } }
            });

            // Built once and mutated in place — see ClaudeAiProvider for why a fresh JsonObject
            // per loop iteration would break (a JsonNode can only have one parent).
            var requestBody = new JsonObject
            {
                ["systemInstruction"] = new JsonObject
                {
                    ["parts"] = new JsonArray
                    {
                        new JsonObject { ["text"] = "You are FinFlow's financial assistant. Answer only using data returned by tools. Be concise and reply in the language the user used." }
                    }
                },
                ["contents"] = contents,
                ["tools"] = new JsonArray { new JsonObject { ["functionDeclarations"] = BuildFunctionDeclarations() } },
                ["generationConfig"] = new JsonObject { ["maxOutputTokens"] = 1024 }
            };

            for (var round = 0; round < MaxToolRounds; round++)
            {
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                cts.CancelAfter(TimeSpan.FromSeconds(20));

                using var response = await client.PostAsJsonAsync(
                    $"v1beta/models/{model}:generateContent?key={Uri.EscapeDataString(apiKey)}", requestBody, cts.Token);

                if (!response.IsSuccessStatusCode)
                {
                    throw new AiProviderUnavailableException(Name, ClassifyHttpStatus(response.StatusCode));
                }

                var json = await response.Content.ReadFromJsonAsync<JsonNode>(cancellationToken: cts.Token);
                var parts = json?["candidates"]?[0]?["content"]?["parts"]?.AsArray() ?? new JsonArray();

                var functionCalls = new List<(string Name, JsonNode? Args)>();
                var textParts = new List<string>();

                foreach (var part in parts)
                {
                    var functionCall = part?["functionCall"];
                    if (functionCall is not null)
                    {
                        functionCalls.Add((functionCall["name"]?.GetValue<string>() ?? string.Empty, functionCall["args"]));
                    }
                    else
                    {
                        var text = part?["text"]?.GetValue<string>();
                        if (!string.IsNullOrEmpty(text))
                        {
                            textParts.Add(text);
                        }
                    }
                }

                if (functionCalls.Count == 0)
                {
                    var answer = string.Concat(textParts);
                    if (string.IsNullOrWhiteSpace(answer))
                    {
                        throw new AiProviderUnavailableException(Name, "empty_response");
                    }
                    return answer;
                }

                // Echo the model's function-call turn back (cloned — `parts` belongs to the
                // response tree), then supply the results, before asking again.
                contents.Add(new JsonObject
                {
                    ["role"] = "model",
                    ["parts"] = JsonNode.Parse(parts.ToJsonString())
                });

                var responseParts = new JsonArray();
                foreach (var (functionName, functionArgs) in functionCalls)
                {
                    var arguments = ToArgumentDictionary(functionArgs);
                    var result = await _toolExecutor.ExecuteAsync(userId, functionName, arguments, cancellationToken);
                    responseParts.Add(new JsonObject
                    {
                        ["functionResponse"] = new JsonObject
                        {
                            ["name"] = functionName,
                            ["response"] = new JsonObject { ["result"] = result }
                        }
                    });
                }
                contents.Add(new JsonObject { ["role"] = "function", ["parts"] = responseParts });
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

    private JsonArray BuildFunctionDeclarations()
    {
        var declarations = new JsonArray();
        foreach (var definition in _toolExecutor.GetToolDefinitions())
        {
            var properties = new JsonObject();
            foreach (var (paramName, param) in definition.Parameters)
            {
                properties[paramName] = new JsonObject
                {
                    ["type"] = param.Type.ToUpperInvariant(),
                    ["description"] = param.Description
                };
            }

            declarations.Add(new JsonObject
            {
                ["name"] = definition.Name,
                ["description"] = definition.Description,
                ["parameters"] = new JsonObject
                {
                    ["type"] = "OBJECT",
                    ["properties"] = properties,
                    ["required"] = new JsonArray(definition.Required.Select(r => (JsonNode)r).ToArray())
                }
            });
        }
        return declarations;
    }

    private static IReadOnlyDictionary<string, string?> ToArgumentDictionary(JsonNode? args)
    {
        var result = new Dictionary<string, string?>();
        if (args is JsonObject obj)
        {
            foreach (var (key, value) in obj)
            {
                result[key] = value switch
                {
                    null => null,
                    JsonValue v when v.TryGetValue<string>(out var s) => s,
                    _ => value.ToJsonString()
                };
            }
        }
        return result;
    }

    private static string ClassifyHttpStatus(HttpStatusCode statusCode)
    {
        if (statusCode == HttpStatusCode.TooManyRequests)
        {
            return "rate_limited";
        }
        return (int)statusCode >= 500 ? "server_error" : "unexpected_error";
    }

    // Timeout/429/5xx are the fallback triggers called out explicitly; anything else is still
    // wrapped (as "unexpected_error") so a genuinely broken primary call doesn't take the whole
    // categorization/assistant flow down with it.
    private string ClassifyFailure(Exception ex)
    {
        var reason = ex switch
        {
            TaskCanceledException => "timeout",
            OperationCanceledException => "timeout",
            HttpRequestException => "network_error",
            _ => "unexpected_error"
        };

        _logger.LogWarning(ex, "Gemini call failed ({Reason}).", reason);
        return reason;
    }
}
