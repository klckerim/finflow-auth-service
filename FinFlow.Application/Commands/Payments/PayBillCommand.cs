
using MediatR;

public record PayBillCommand(
    string Email,
    decimal Amount,
    Guid? WalletId,
    Guid? CardId,
    string Currency,
    string Description,
    PaymentType? PaymentType
) : IRequest<Guid>;
