/// Provider-agnostic description of a tool the financial assistant can call.
/// Each <see cref="IAiProvider"/> translates this into its own wire format.
public record AssistantToolParameter(string Type, string Description);

public record AssistantToolDefinition(
    string Name,
    string Description,
    IReadOnlyDictionary<string, AssistantToolParameter> Parameters,
    IReadOnlyList<string> Required);
