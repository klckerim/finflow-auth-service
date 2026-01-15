using MediatR;

public class DepositHandler : IRequestHandler<DepositCommand, bool>
{
    private readonly IWalletRepository _walletRepository;
    private readonly ITransactionRepository _transactionRepository;

    public DepositHandler(IWalletRepository walletRepository, ITransactionRepository transactionRepository)
    {
        _walletRepository = walletRepository;
        _transactionRepository = transactionRepository;
    }

    public async Task<bool> Handle(DepositCommand request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.IdempotencyKey))
        {
            var existing = await _transactionRepository.GetByIdempotencyKeyAsync(
                request.IdempotencyKey,
                TransactionType.Deposit,
                cancellationToken);
            if (existing != null)
            {
                return true;
            }
        }

        var success = await _walletRepository
            .IncreaseBalanceWithTransactionAsync(request.WalletId, request.Amount, request.IdempotencyKey,cancellationToken);

        if (!success)
            throw new AppException(ErrorCodes.WalletNotFound, "", 404, new Dictionary<string, object> { { "Id", request.WalletId }, });

        return true;
    }
}
