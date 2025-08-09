using MediatR;

public record GetTransactionsByWalletIdQuery(Guid WalletId, int Limit) : IRequest<List<TransactionDto>>;
