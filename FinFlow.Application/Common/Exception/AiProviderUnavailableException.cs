/// Thrown by an <see cref="IAiProvider"/> when it cannot produce a usable result
/// (timeout, rate limit, server error, or an empty/unusable response) so the
/// fallback orchestrator knows to try the next provider.
public class AiProviderUnavailableException : Exception
{
    public AiProviderUnavailableException(string providerName, string reason, Exception? inner = null)
        : base($"{providerName} unavailable: {reason}", inner)
    {
    }
}
