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
        var currency = CurrencyCodes.Normalize(request.Currency);
        if (!CurrencyCodes.IsSupported(currency))
        {
            throw new AppException(
                ErrorCodes.InvalidCurrency,
                "Unsupported deposit currency.",
                400,
                new Dictionary<string, object> { { "Currency", request.Currency } });
        }

        var wallet = await _walletRepository.GetByIdAsync(request.WalletId, cancellationToken);
        if (wallet == null)
        {
            throw new AppException(ErrorCodes.WalletNotFound, "", 404, new Dictionary<string, object> { { "Id", request.WalletId }, });
        }

        if (!string.Equals(wallet.Currency, currency, StringComparison.OrdinalIgnoreCase))
        {
            throw new AppException(
                ErrorCodes.WalletCurrencyMismatch,
                "Deposit currency does not match wallet currency.",
                400,
                new Dictionary<string, object> { { "Currency", wallet.Currency } });
        }

        var success = await _walletRepository
            .IncreaseBalanceWithTransactionAsync(request.WalletId, request.Amount, cancellationToken);

        if (!success)
            throw new AppException(ErrorCodes.WalletNotFound, "", 404, new Dictionary<string, object> { { "Id", request.WalletId }, });

        return true;
    }
}
