using AutoMapper;
using MediatR;

public class GetPaymentMethodByIdQueryHandler : IRequestHandler<GetPaymentMethodByIdQuery, PaymentMethodDto?>
{
    private readonly IPaymentMethodRepository _paymentRepo;
    private readonly IMapper _mapper;

    public GetPaymentMethodByIdQueryHandler(IPaymentMethodRepository paymentRepo, IMapper mapper)
    {
        _paymentRepo = paymentRepo;
        _mapper = mapper;
    }


    public async Task<PaymentMethodDto?> Handle(GetPaymentMethodByIdQuery request, CancellationToken cancellationToken)
    {
        var  paymentMethod = await _paymentRepo.GetByIdAsync(request.CardId, cancellationToken);

        return paymentMethod is null ? null : _mapper.Map<PaymentMethodDto>(paymentMethod);
    }
}
