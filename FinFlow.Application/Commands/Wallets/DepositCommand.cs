using MediatR;

public record DepositCommand(Guid WalletId, decimal Amount, string? IdempotencyKey) : IRequest<bool>;
