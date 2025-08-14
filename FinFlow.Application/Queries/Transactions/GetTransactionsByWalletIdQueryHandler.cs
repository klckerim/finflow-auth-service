
using AutoMapper;
using MediatR;

public class GetTransactionsByWalletIdQueryHandler : IRequestHandler<GetTransactionsByWalletIdQuery, List<TransactionDto>>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IMapper _mapper;

    public GetTransactionsByWalletIdQueryHandler(ITransactionRepository transactionRepository, IMapper mapper)
    {
        _mapper = mapper;
        _transactionRepository = transactionRepository;
    }

    public async Task<List<TransactionDto>> Handle(GetTransactionsByWalletIdQuery request, CancellationToken cancellationToken)
    {
        var transactions = await _transactionRepository.GetTransactionsByWalletIdAsync(request.WalletId, request.Limit, cancellationToken);

        if (transactions is null || !transactions.Any())
        {
            return new List<TransactionDto>();
        }

        return _mapper.Map<List<TransactionDto>>(transactions);
    }
}
