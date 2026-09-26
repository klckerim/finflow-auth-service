/// Answers "does this user own that resource?" for ids that arrive from the outside (route,
/// body, or an LLM tool call). Commands and queries stay user-agnostic because some of them
/// also run in a system context (e.g. the Stripe webhook deposits into a wallet), so the
/// ownership check is enforced at the entry point instead.
public interface IResourceOwnershipService
{
    Task<bool> OwnsWalletAsync(Guid userId, Guid walletId, CancellationToken cancellationToken = default);

    Task<bool> OwnsPaymentMethodAsync(Guid userId, Guid paymentMethodId, CancellationToken cancellationToken = default);
}
