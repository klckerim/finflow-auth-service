using MediatR;

public record DepositCommand(Guid WalletId, decimal Amount) : IRequest<bool>;
