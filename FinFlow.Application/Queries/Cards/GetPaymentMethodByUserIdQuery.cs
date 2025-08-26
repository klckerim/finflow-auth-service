using MediatR;

public record GetPaymentMethodByUserIdQuery(Guid UserId) : IRequest<List<PaymentMethodDto>>;
