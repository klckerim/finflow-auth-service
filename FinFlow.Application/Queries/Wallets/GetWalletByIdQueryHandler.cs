using FinFlow.Domain.Entities;
using MediatR;

public class GetWalletByIdQueryHandler : IRequestHandler<GetWalletByIdQuery, Wallet?>
{
    private readonly IWalletRepository _walletRepository;

    public GetWalletByIdQueryHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<Wallet?> Handle(GetWalletByIdQuery request, CancellationToken cancellationToken)
    {
        return await _walletRepository.GetByIdAsync(request.Id);
    }
}
