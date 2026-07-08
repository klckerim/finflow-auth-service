using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

/// <summary>
/// Implements the app-facing <see cref="ITransactionCategorizationService"/> contract by trying
/// the primary <see cref="IAiProvider"/> (Gemini) first and automatically falling back to the
/// secondary provider (Anthropic) when the primary throws <see cref="AiProviderUnavailableException"/>
/// (or fails unexpectedly). If both providers fail, categorization degrades to <see cref="TransactionCategory.Other"/>
/// rather than throwing — categorization must never block money movement.
/// Depends only on the <see cref="IAiProvider"/> abstraction, so it can be unit tested with fakes
/// for both the primary and fallback provider.
/// </summary>
public class FallbackTransactionCategorizationService : ITransactionCategorizationService
{
    private readonly IAiProvider _primary;
    private readonly IAiProvider _fallback;
    private readonly ILogger<FallbackTransactionCategorizationService> _logger;

    public FallbackTransactionCategorizationService(
        [FromKeyedServices("primary")] IAiProvider primary,
        [FromKeyedServices("fallback")] IAiProvider fallback,
        ILogger<FallbackTransactionCategorizationService> logger)
    {
        _primary = primary;
        _fallback = fallback;
        _logger = logger;
    }

    public async Task<TransactionCategory> CategorizeAsync(string? description, decimal amount, TransactionType type, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _primary.CategorizeAsync(description, amount, type, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "{Primary} categorization failed; falling back to {Fallback}.", _primary.Name, _fallback.Name);
        }

        try
        {
            return await _fallback.CategorizeAsync(description, amount, type, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "{Fallback} categorization also failed; defaulting to Other.", _fallback.Name);
            return TransactionCategory.Other;
        }
    }
}
