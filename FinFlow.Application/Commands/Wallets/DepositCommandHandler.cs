using FinFlow.Domain.Entities;
using MediatR;

public class DepositCommandHandler : IRequestHandler<DepositCommand, bool>
{
    private readonly IWalletRepository _walletRepository;
    private readonly ITransactionRepository _transactionRepository;

    public DepositCommandHandler(
        IWalletRepository walletRepository,
        ITransactionRepository transactionRepository)
    {
        _walletRepository = walletRepository;
        _transactionRepository = transactionRepository;
    }

    public async Task<bool> Handle(DepositCommand request, CancellationToken cancellationToken)
    {
        var wallet = await _walletRepository.GetByIdAsync(request.WalletId, cancellationToken);
        if (wallet == null)
            throw new KeyNotFoundException($"Wallet not found.");

        wallet.Balance += request.Amount;
        await _walletRepository.UpdateAsync(wallet);

        var transaction = new Transaction
        {
            WalletId = request.WalletId,
            Amount = request.Amount,
            Type = TransactionType.Deposit,
            Description = "Money has been deposited."
        };
        await _transactionRepository.AddAsync(transaction, cancellationToken);

        return true;
    }
}
