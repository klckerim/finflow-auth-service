using FinFlow.Domain.Entities;
using MediatR;

public class TransferCommandHandler : IRequestHandler<TransferCommand>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IWalletRepository _walletRepository;

    public TransferCommandHandler(
        IWalletRepository walletRepository,
        ITransactionRepository transactionRepository)
    {
        _walletRepository = walletRepository;
        _transactionRepository = transactionRepository;
    }

    public async Task<Unit> Handle(TransferCommand request, CancellationToken cancellationToken)
    {
        var fromWallet = await _walletRepository.GetByIdAsync(request.FromWalletId, cancellationToken);
        if (fromWallet == null)
            throw new KeyNotFoundException("Source wallet not found.");

        var toWallet = await _walletRepository.GetByIdAsync(request.ToWalletId, cancellationToken);
        if (toWallet == null)
            throw new KeyNotFoundException("Recipient wallet not found.");

        if (fromWallet.Balance < request.Amount)
            throw new InvalidOperationException("Insufficient balance.");

        if (fromWallet.Currency != toWallet.Currency)
            throw new InvalidOperationException($"Recipient wallet currency must be {fromWallet.Currency}");

        fromWallet.Balance -= request.Amount;
        toWallet.Balance += request.Amount;

        // Transaction kayıtları
        var fromTransaction = new Transaction
        {
            WalletId = fromWallet.Id,
            Amount = -request.Amount,
            Type = TransactionType.Transfer,
            Description = $"Transfer to wallet {toWallet.Name}"
        };

        var toTransaction = new Transaction
        {
            WalletId = toWallet.Id,
            Amount = request.Amount,
            Type = TransactionType.Transfer,
            Description = $"Transfer from wallet {fromWallet.Name}"
        };

        await _transactionRepository.AddAsync(fromTransaction, cancellationToken);
        await _transactionRepository.AddAsync(toTransaction, cancellationToken);

        await _walletRepository.UpdateAsync(fromWallet);
        await _walletRepository.UpdateAsync(toWallet);

        return Unit.Value;
    }

}
