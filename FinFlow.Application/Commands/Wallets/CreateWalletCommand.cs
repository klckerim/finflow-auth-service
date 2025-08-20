using MediatR;

public record CreateWalletCommand(Guid UserId, string Currency = "EUR", string Name = "", decimal Balance = 0) : IRequest<Guid>;
