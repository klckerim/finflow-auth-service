using MediatR;

public record BulkCategorizeTransactionsCommand(Guid UserId) : IRequest<int>;
