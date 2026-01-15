using MediatR;

public record TransferCommand(Guid FromWalletId, Guid ToWalletId, decimal Amount, string? IdempotencyKey) : IRequest;