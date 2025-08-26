using MediatR;

public class DepositHandler : IRequestHandler<DepositCommand, bool>
{
    private readonly IWalletRepository _walletRepository;

    public DepositHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<bool> Handle(DepositCommand request, CancellationToken cancellationToken)
    {
        var success = await _walletRepository
            .IncreaseBalanceWithTransactionAsync(request.WalletId, request.Amount, cancellationToken);

        if (!success)
            throw new AppException(ErrorCodes.WalletNotFound, "", 404, new Dictionary<string, object> { { "Id", request.WalletId }, });

        return true;
    }
}
