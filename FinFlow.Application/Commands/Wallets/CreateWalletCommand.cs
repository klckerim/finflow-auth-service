using MediatR;

public record CreateWalletCommand(Guid UserId, string Currency = "TRY") : IRequest<Guid>;
