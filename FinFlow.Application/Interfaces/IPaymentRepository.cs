
using FinFlow.Domain.Entities;

public interface IPaymentMethodRepository
{
    Task AddAsync(PaymentMethod pm, CancellationToken ct = default);
    Task<List<PaymentMethod>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<PaymentMethod?> GetByIdAsync(Guid cardId, CancellationToken ct = default);
    Task SetDefaultAsync(Guid userId, Guid paymentMethodId, CancellationToken ct = default);
    Task ClearDefaultAsync(Guid userId, CancellationToken cancellationToken = default);
}
