using Microsoft.Extensions.Logging;

public static class AssistantToolExecutorExtensions
{
    /// Model-facing message for an unexpected tool failure. Deliberately generic: exception
    /// details stay in the logs, and the model is told not to fill the gap with guesses.
    public static string InternalErrorMessage(string toolName) =>
        $"Tool '{toolName}' failed due to an internal error, so this data is currently unavailable. " +
        "Tell the user it could not be retrieved right now; do not guess or invent values.";

    /// Provider-side guard around <see cref="IAssistantToolExecutor.ExecuteAsync"/>. The
    /// executor's never-throw contract isn't enforced by the type system, so a throwing
    /// implementation is converted into an error tool result here instead of escaping the
    /// provider's tool loop and failing the whole assistant turn. Caller cancellation still
    /// propagates.
    public static async Task<AssistantToolResult> ExecuteSafelyAsync(
        this IAssistantToolExecutor executor,
        Guid userId,
        string toolName,
        IReadOnlyDictionary<string, string?> arguments,
        ILogger logger,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return await executor.ExecuteAsync(userId, toolName, arguments, cancellationToken);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Assistant tool {ToolName} threw; returning it to the model as an error result.", toolName);
            return AssistantToolResult.Error(InternalErrorMessage(toolName));
        }
    }
}
