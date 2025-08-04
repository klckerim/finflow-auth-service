using AutoMapper;
using MediatR;

public class GetWalletsByUserIdQueryHandler : IRequestHandler<GetWalletsByUserIdQuery, List<WalletDto>>
{
    private readonly IWalletRepository _walletRepository;
    private readonly IMapper _mapper;

    public GetWalletsByUserIdQueryHandler(IWalletRepository walletRepository, IMapper mapper)
    {
        _walletRepository = walletRepository;
        _mapper = mapper;
    }

    public async Task<List<WalletDto>> Handle(GetWalletsByUserIdQuery request, CancellationToken cancellationToken)
    {
        var wallets = await _walletRepository.GetByUserIdAsync(request.UserId, cancellationToken);

        if (wallets is null || !wallets.Any())
            return new List<WalletDto>();

        return _mapper.Map<List<WalletDto>>(wallets);
    }
}
