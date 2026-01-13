using FinFlow.Domain.Entities;
using MediatR;

public class CreateWalletHandler : IRequestHandler<CreateWalletCommand, Guid>
{
    private readonly IWalletRepository _walletRepository;

    public CreateWalletHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<Guid> Handle(CreateWalletCommand request, CancellationToken cancellationToken)
    {
        var currency = CurrencyCodes.Normalize(request.Currency);
        if (!CurrencyCodes.IsSupported(currency))
        {
            throw new AppException(
                ErrorCodes.InvalidCurrency,
                "Unsupported wallet currency.",
                400,
                new Dictionary<string, object> { { "Currency", request.Currency } });
        }

        var wallet = new Wallet
        {
            UserId = request.UserId,
            Currency = currency,
            Name = request.Name,
            Balance = request.Balance,
            CreatedAt = DateTime.UtcNow,
            Transactions = new List<Transaction>()
        };

        await _walletRepository.AddAsync(wallet);

        return wallet.Id;
    }
}
