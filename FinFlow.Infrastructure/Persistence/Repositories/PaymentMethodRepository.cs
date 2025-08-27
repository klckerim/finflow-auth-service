using FinFlow.Domain.Entities;
using FinFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


public class PaymentMethodRepository : IPaymentMethodRepository
{
    private readonly IDbContextFactory<FinFlowDbContext> _contextFactory;

    public PaymentMethodRepository(IDbContextFactory<FinFlowDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task AddAsync(PaymentMethod pm, CancellationToken ct = default)
    {
        await using var db = await _contextFactory.CreateDbContextAsync(ct);
        await db.PaymentMethods.AddAsync(pm, ct);
        await db.SaveChangesAsync(ct);
    }

    public async Task ClearDefaultAsync(Guid userId, CancellationToken ct = default)
    {
        await using var db = await _contextFactory.CreateDbContextAsync(ct);
        var methods = db.PaymentMethods.Where(pm => pm.UserId == userId && pm.IsDefault);
        await methods.ForEachAsync(pm => pm.IsDefault = false, ct);
        await db.SaveChangesAsync(ct);
    }

    public async Task<List<PaymentMethod>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        await using var db = await _contextFactory.CreateDbContextAsync(ct);
        return await db.PaymentMethods
        .Include(p => p.Transactions)
        .Where(p => p.UserId == userId).ToListAsync(ct);
    }

    public async Task<PaymentMethod?> GetByIdAsync(Guid cardId, CancellationToken ct)
    {
        await using var db = await _contextFactory.CreateDbContextAsync(ct);
        return await db.PaymentMethods
        .Include(p => p.Transactions)
        .FirstOrDefaultAsync(p => p.Id == cardId, ct);
    }

    public async Task SetDefaultAsync(Guid userId, Guid paymentMethodId, CancellationToken ct = default)
    {
        await using var db = await _contextFactory.CreateDbContextAsync(ct);
        var list = await db.PaymentMethods.Where(p => p.UserId == userId).ToListAsync(ct);
        foreach (var p in list) p.IsDefault = p.Id == paymentMethodId;
        await db.SaveChangesAsync(ct);
    }
}
