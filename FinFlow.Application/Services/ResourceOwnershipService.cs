public class ResourceOwnershipService : IResourceOwnershipService
{
    private readonly IWalletRepository _walletRepository;
    private readonly IPaymentMethodRepository _paymentMethodRepository;

    public ResourceOwnershipService(IWalletRepository walletRepository, IPaymentMethodRepository paymentMethodRepository)
    {
        _walletRepository = walletRepository;
        _paymentMethodRepository = paymentMethodRepository;
    }

    public Task<bool> OwnsWalletAsync(Guid userId, Guid walletId, CancellationToken cancellationToken = default) =>
        _walletRepository.IsOwnedByAsync(walletId, userId, cancellationToken);

    public Task<bool> OwnsPaymentMethodAsync(Guid userId, Guid paymentMethodId, CancellationToken cancellationToken = default) =>
        _paymentMethodRepository.IsOwnedByAsync(paymentMethodId, userId, cancellationToken);
}
