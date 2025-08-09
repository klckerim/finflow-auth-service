using MediatR;

public record GetTransactionsByUserIdQuery(Guid UserId, int Limit) : IRequest<List<TransactionDto>>;
