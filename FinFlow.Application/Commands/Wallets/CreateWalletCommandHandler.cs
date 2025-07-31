using FinFlow.Domain.Entities;
using MediatR;

public class CreateWalletCommandHandler : IRequestHandler<CreateWalletCommand, Guid>
{
    private readonly IWalletRepository _walletRepository;

    public CreateWalletCommandHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<Guid> Handle(CreateWalletCommand request, CancellationToken cancellationToken)
    {
        var wallet = new Wallet
        {
            UserId = request.UserId,
            Currency = request.Currency,
            Balance = 0,
            CreatedAt = DateTime.UtcNow,
            Transactions = new List<Transaction>()
        };

        await _walletRepository.AddAsync(wallet);

        return wallet.Id;
    }
}
