
using MediatR;

public record GetWalletByIdQuery(Guid WalletId) : IRequest<WalletDto>;

