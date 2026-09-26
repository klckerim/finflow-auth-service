/// Outcome of a single assistant tool call. <see cref="IsError"/> is surfaced to the model
/// (Claude: tool_result.is_error, Gemini: functionResponse.response.error) so it can tell a
/// failed lookup apart from real data and answer the user accordingly instead of the whole
/// turn being aborted.
public record AssistantToolResult(string Content, bool IsError)
{
    public static AssistantToolResult Success(string content) => new(content, false);

    public static AssistantToolResult Error(string message) => new(message, true);
}
