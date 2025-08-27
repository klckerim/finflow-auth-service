
using AutoMapper;
using MediatR;

public class GetTransactionsByUserIdQueryHandler : IRequestHandler<GetTransactionsByUserIdQuery, List<TransactionDto>>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IMapper _mapper;

    public GetTransactionsByUserIdQueryHandler(ITransactionRepository transactionRepository, IMapper mapper)
    {
        _mapper = mapper;
        _transactionRepository = transactionRepository;
    }

    public async Task<List<TransactionDto>> Handle(GetTransactionsByUserIdQuery request, CancellationToken cancellationToken)
    {
        var transactions = await _transactionRepository.GetTransactionsByUserIdAsync(request.UserId, request.Limit, cancellationToken);

        if (transactions is null || !transactions.Any())
        {
            return new List<TransactionDto>();
        }

        return transactions.Select(t => new TransactionDto
        {
            WalletId = t.WalletId,
            PaymentMethodId = t.PaymentMethodId,
            Id = t.Id,
            Amount = t.Amount,
            Type = t.Type.ToString(),
            CreatedAt = t.CreatedAt,
            Currency = t.Wallet?.Currency ?? "USD",
            Description = t.Description
        }).ToList();
    }
}
