using FinFlow.Domain.Entities;
using MediatR;

public class SavePaymentMethodHandler : IRequestHandler<SavePaymentMethodCommand, bool>
{
    private readonly IPaymentMethodRepository _repo;

    public SavePaymentMethodHandler(IPaymentMethodRepository repo)
    {
        _repo = repo;
    }

    public async Task<bool> Handle(SavePaymentMethodCommand request, CancellationToken cancellationToken)
    {
        if (request.IsDefault)
        {
            await _repo.ClearDefaultAsync(request.UserId, cancellationToken);
        }

        // before adding, check if exists:
        var existing = await _repo.GetByUserIdAsync(request.UserId, cancellationToken);
        if (!existing.Any(p => p.StripePaymentMethodId == request.StripePaymentMethodId))
        {

            var pm = new PaymentMethod
            {
                UserId = request.UserId,
                StripePaymentMethodId = request.StripePaymentMethodId,
                Brand = request.Brand,
                Last4 = request.Last4,
                ExpMonth = request.ExpMonth,
                ExpYear = request.ExpYear,
                CardHolderName = request.CardHolderName,
                IsDefault = request.IsDefault,
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(pm, cancellationToken);
        }
        else
        {
            throw new AppException(ErrorCodes.PaymentMethodExists, "", 404, new Dictionary<string, object> { { "PaymentMethodId", request.StripePaymentMethodId }, { "UserId", request.UserId } });
        }

        return true;
    }
}
