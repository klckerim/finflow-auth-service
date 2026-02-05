using FinFlow.Domain.Entities;
using MediatR;

public class TransferHandler : IRequestHandler<TransferCommand>
{
    private readonly IWalletRepository _walletRepository;

    public TransferHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<Unit> Handle(TransferCommand request, CancellationToken cancellationToken)
    {
        await _walletRepository.TransferWithTransactionsAsync(
             request.FromWalletId,
             request.ToWalletId,
             request.Amount,
             request.IdempotencyKey,
             cancellationToken);

        return Unit.Value;
    }

}
