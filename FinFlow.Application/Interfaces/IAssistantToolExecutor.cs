/// Shared, provider-agnostic tool surface for the financial assistant: the tool schemas
/// and their dispatch to the existing MediatR queries live here once, so Claude and Gemini
/// providers don't each reimplement "which query does get_wallets map to".
public interface IAssistantToolExecutor
{
    IReadOnlyList<AssistantToolDefinition> GetToolDefinitions();

    /// Executes a tool by name for the given (server-side, JWT-resolved) userId.
    /// Never throws — returns a short error string instead, since a failed tool call
    /// should be reported back to the model as a tool_result, not abort the turn.
    Task<string> ExecuteAsync(Guid userId, string toolName, IReadOnlyDictionary<string, string?> arguments, CancellationToken cancellationToken = default);
}
