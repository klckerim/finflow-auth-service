using MediatR;

public class TransferCommandHandler : IRequestHandler<TransferCommand>
{
    private readonly IWalletRepository _walletRepository;

    public TransferCommandHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<Unit> Handle(TransferCommand request, CancellationToken cancellationToken)
    {
        var fromWallet = await _walletRepository.GetByIdAsync(request.FromWalletId);
        if (fromWallet == null)
            throw new KeyNotFoundException($"Source wallet with id {request.FromWalletId} not found.");

        var toWallet = await _walletRepository.GetByIdAsync(request.ToWalletId);
        if (toWallet == null)
            throw new KeyNotFoundException($"Destination wallet with id {request.ToWalletId} not found.");

        if (fromWallet.Balance < request.Amount)
            throw new InvalidOperationException("Insufficient balance.");

        fromWallet.Balance -= request.Amount;
        toWallet.Balance += request.Amount;

        // Transaction entity eklenecek

        await _walletRepository.UpdateAsync(fromWallet);
        await _walletRepository.UpdateAsync(toWallet);

        return Unit.Value;
    }
}
