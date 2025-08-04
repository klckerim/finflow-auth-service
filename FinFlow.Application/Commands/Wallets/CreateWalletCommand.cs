using MediatR;

public record CreateWalletCommand(Guid UserId, string Currency = "TRY", string Name = "", decimal Balance = 0) : IRequest<Guid>;
