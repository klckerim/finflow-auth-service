using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

/// <summary>
/// Implements the app-facing <see cref="IAiAssistantService"/> contract with the same
/// primary/fallback pattern as <see cref="FallbackTransactionCategorizationService"/>:
/// Gemini first, Anthropic on failure, a friendly apology if both fail.
/// </summary>
public class FallbackAiAssistantService : IAiAssistantService
{
    private readonly IAiProvider _primary;
    private readonly IAiProvider _fallback;
    private readonly ILogger<FallbackAiAssistantService> _logger;

    public FallbackAiAssistantService(
        [FromKeyedServices("primary")] IAiProvider primary,
        [FromKeyedServices("fallback")] IAiProvider fallback,
        ILogger<FallbackAiAssistantService> logger)
    {
        _primary = primary;
        _fallback = fallback;
        _logger = logger;
    }

    public async Task<string> AskAsync(Guid userId, string message, IReadOnlyList<ChatMessageDto> history, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _primary.AskAsync(userId, message, history, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "{Primary} assistant call failed; falling back to {Fallback}.", _primary.Name, _fallback.Name);
        }

        try
        {
            return await _fallback.AskAsync(userId, message, history, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "{Fallback} assistant call also failed.", _fallback.Name);
            return "Sorry, I couldn't reach the AI assistant right now.";
        }
    }
}
