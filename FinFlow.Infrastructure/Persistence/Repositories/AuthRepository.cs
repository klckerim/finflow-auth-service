// Infrastructure/Repositories/AuthRepository.cs
using FinFlow.Domain.Entities;
using FinFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class AuthRepository : IAuthRepository
{
    private readonly FinFlowDbContext _db;
    public AuthRepository(FinFlowDbContext db) => _db = db;

    public Task<User?> GetUserByEmailAsync(string email, CancellationToken ct) =>
        _db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

    public async Task AddResetPasswordTokenAsync(ResetPasswordToken token, CancellationToken ct)
    {
        _db.ResetPasswordTokens.Add(token);
        await _db.SaveChangesAsync(ct);
    }

    public Task<ResetPasswordToken?> GetValidResetTokenAsync(string token, CancellationToken ct) =>
        _db.ResetPasswordTokens
           .Include(t => t.User)
           .FirstOrDefaultAsync(t => t.Token == token && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow, ct);

    public Task SaveChangesAsync(CancellationToken ct) => _db.SaveChangesAsync(ct);
}
