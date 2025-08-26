using FinFlow.Domain.Entities;
using MediatR;

public record SavePaymentMethodCommand(
    Guid UserId,
    string StripePaymentMethodId,
    string Brand,
    string Last4,
    long ExpMonth,
    long ExpYear,
    string? CardHolderName,
    bool IsDefault = false
) : IRequest<bool>;
