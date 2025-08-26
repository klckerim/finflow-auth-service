using MediatR;

public record GetTransactionsByCardIdQuery(Guid CardId, int Limit) : IRequest<List<TransactionDto>>;
