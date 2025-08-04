using FinFlow.Domain.Entities;
using MediatR;

public record GetWalletsByUserIdQuery(Guid UserId) : IRequest<List<WalletDto>>;
