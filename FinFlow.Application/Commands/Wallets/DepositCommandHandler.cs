using MediatR;

public class DepositCommandHandler : IRequestHandler<DepositCommand>
{
    private readonly IWalletRepository _walletRepository;

    public DepositCommandHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<Unit> Handle(DepositCommand request, CancellationToken cancellationToken)
    {
        var wallet = await _walletRepository.GetByIdAsync(request.WalletId, cancellationToken);
        if (wallet == null)
            throw new KeyNotFoundException($"Wallet with id {request.WalletId} not found.");

        wallet.Balance += request.Amount;

        await _walletRepository.UpdateAsync(wallet);

        return Unit.Value;
    }
}
