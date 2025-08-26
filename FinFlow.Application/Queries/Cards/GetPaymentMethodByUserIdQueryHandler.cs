using MediatR;
using AutoMapper;

public class GetPaymentMethodByUserIdQueryHandler : IRequestHandler<GetPaymentMethodByUserIdQuery, List<PaymentMethodDto>>
{
    private readonly IPaymentMethodRepository _paymentRepo;
    private readonly IMapper _mapper;

    public GetPaymentMethodByUserIdQueryHandler(IPaymentMethodRepository paymentRepo, IMapper mapper)
    {
        _paymentRepo = paymentRepo;
        _mapper = mapper;
    }

    public async Task<List<PaymentMethodDto>> Handle(GetPaymentMethodByUserIdQuery request, CancellationToken cancellationToken)
    {
        var paymentMethods = await _paymentRepo.GetByUserIdAsync(request.UserId, cancellationToken);

        if (paymentMethods is null || !paymentMethods.Any())
        {
            return new List<PaymentMethodDto>();
        }

        return _mapper.Map<List<PaymentMethodDto>>(paymentMethods);
    }
}
