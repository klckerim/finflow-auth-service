using MediatR;

public record DepositCommand(Guid WalletId, decimal Amount, string Currency) : IRequest<bool>;
