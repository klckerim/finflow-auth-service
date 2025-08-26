using MediatR;

public class DeleteWalletHandler : IRequestHandler<DeleteWalletCommand, bool>
{
    private readonly IWalletRepository _walletRepository;

    public DeleteWalletHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<bool> Handle(DeleteWalletCommand request, CancellationToken cancellationToken)
    {
        var wallet = await _walletRepository.GetByIdAsync(request.WalletId, cancellationToken);

        if (wallet == null)
            return false;

        await _walletRepository.DeleteAsync(wallet);

        return true;
    }
}
