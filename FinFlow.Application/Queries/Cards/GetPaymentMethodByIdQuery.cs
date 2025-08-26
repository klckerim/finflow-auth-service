
using MediatR;

public record GetPaymentMethodByIdQuery(Guid CardId) : IRequest<PaymentMethodDto>;

