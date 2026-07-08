/// Common abstraction for every LLM provider (Claude, Gemini, ...). Implementations must
/// throw <see cref="AiProviderUnavailableException"/> — never a bare provider-SDK exception —
/// on timeout, rate limiting, server errors, or an empty/unusable response, so that a
/// fallback orchestrator can decide to try the next provider.
public interface IAiProvider
{
    /// Short provider name used in logs (e.g. "Gemini", "Anthropic").
    string Name { get; }

    Task<TransactionCategory> CategorizeAsync(string? description, decimal amount, TransactionType type, CancellationToken cancellationToken = default);

    Task<string> AskAsync(Guid userId, string message, IReadOnlyList<ChatMessageDto> history, CancellationToken cancellationToken = default);
}
