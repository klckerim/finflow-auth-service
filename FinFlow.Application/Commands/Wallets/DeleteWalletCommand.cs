using MediatR;

public record DeleteWalletCommand(Guid WalletId) : IRequest<bool>;
