
using AutoMapper;
using MediatR;

public class GetTransactionsByCardIdQueryHandler : IRequestHandler<GetTransactionsByCardIdQuery, List<TransactionDto>>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IMapper _mapper;

    public GetTransactionsByCardIdQueryHandler(ITransactionRepository transactionRepository, IMapper mapper)
    {
        _mapper = mapper;
        _transactionRepository = transactionRepository;
    }

    public async Task<List<TransactionDto>> Handle(GetTransactionsByCardIdQuery request, CancellationToken cancellationToken)
    {
        var transactions = await _transactionRepository.GetTransactionsByCardIdAsync(request.CardId, request.Limit, cancellationToken);

        if (transactions is null || !transactions.Any())
        {
            return new List<TransactionDto>();
        }

        return _mapper.Map<List<TransactionDto>>(transactions);
    }
}
