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
        var wallet = new Wallet
        {
            UserId = request.UserId,
            Currency = request.Currency,
            Name = request.Name,
            Balance = request.Balance,
            CreatedAt = DateTime.UtcNow,
            Transactions = new List<Transaction>()
        };

        await _walletRepository.AddAsync(wallet);

        return wallet.Id;
    }
}
