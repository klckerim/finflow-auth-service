using FinFlow.Domain.Entities;
using MediatR;

public record GetWalletByIdQuery(Guid Id) : IRequest<Wallet?>;
