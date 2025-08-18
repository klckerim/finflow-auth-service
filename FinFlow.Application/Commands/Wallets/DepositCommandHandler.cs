using FinFlow.Domain.Entities;
using MediatR;

public class DepositCommandHandler : IRequestHandler<DepositCommand, bool>
{
    private readonly IWalletRepository _walletRepository;

    public DepositCommandHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<bool> Handle(DepositCommand request, CancellationToken cancellationToken)
    {
        var success = await _walletRepository
            .IncreaseBalanceWithTransactionAsync(request.WalletId, request.Amount, cancellationToken);

        if (!success)
            throw new KeyNotFoundException($"Wallet not found or filtered out. Id={request.WalletId}");

        return true;
    }
}
