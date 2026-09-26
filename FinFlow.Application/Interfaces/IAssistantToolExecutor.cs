/// Shared, provider-agnostic tool surface for the financial assistant: the tool schemas
/// and their dispatch to the existing MediatR queries live here once, so Claude and Gemini
/// providers don't each reimplement "which query does get_wallets map to".
public interface IAssistantToolExecutor
{
    IReadOnlyList<AssistantToolDefinition> GetToolDefinitions();

    /// Executes a tool by name for the given (server-side, JWT-resolved) userId.
    /// Never throws for tool failures — returns an <see cref="AssistantToolResult"/> with
    /// IsError set instead, since a failed tool call should be reported back to the model
    /// as an error tool result, not abort the turn. Only cancellation propagates.
    Task<AssistantToolResult> ExecuteAsync(Guid userId, string toolName, IReadOnlyDictionary<string, string?> arguments, CancellationToken cancellationToken = default);
}
