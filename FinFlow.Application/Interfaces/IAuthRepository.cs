using FinFlow.Domain.Entities;

public interface IAuthRepository
{
    Task<User?> GetUserByEmailAsync(string email, CancellationToken ct);
    Task AddResetPasswordTokenAsync(ResetPasswordToken token, CancellationToken ct);
    Task<ResetPasswordToken?> GetValidResetTokenAsync(string token, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}
