/// Answers natural-language questions about a user's own wallets/transactions,
/// grounding responses in real data via tool calls scoped to the given userId.
public interface IAiAssistantService
{
    Task<string> AskAsync(Guid userId, string message, IReadOnlyList<ChatMessageDto> history, CancellationToken cancellationToken = default);
}
