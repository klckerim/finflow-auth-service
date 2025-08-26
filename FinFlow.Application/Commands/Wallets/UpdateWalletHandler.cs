using MediatR;

public class UpdateWalletHandler : IRequestHandler<UpdateWalletCommand, bool>
{
    private readonly IWalletRepository _walletRepository;

    public UpdateWalletHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<bool> Handle(UpdateWalletCommand request, CancellationToken cancellationToken)
    {
        var wallet = await _walletRepository.GetByIdAsync(request.WalletId, cancellationToken);

        if (wallet is null)
            return false;

        wallet.Name = request.Name;

        await _walletRepository.UpdateAsync(wallet);
        return true;
    }
}
