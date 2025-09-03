using FinFlow.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace FinFlow.Application.Commands.Users
{
    public class ResetPasswordHandler : IRequestHandler<ResetPasswordCommand, bool>
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IPasswordHasher<User> _hasher;


        public ResetPasswordHandler(IAuthRepository repo, IConfiguration config, IPasswordHasher<User> hasher)
        {
            _repo = repo;
            _config = config;
            _hasher = hasher;
        }

        public async Task<bool> Handle(ResetPasswordCommand req, CancellationToken ct)
        {

            var tokenEntry = await _repo.GetValidResetTokenAsync(req.Token, ct);
            if (tokenEntry is null)
                throw new AppException(ErrorCodes.InvalidCredentials, "");

            var user = tokenEntry.User;
            user.PasswordHash = _hasher.HashPassword(user, req.Password);

            // token tek kullanımlık
            tokenEntry.IsUsed = true;

            // refresh token’ları iptal (varsa)
            if (user.RefreshTokens is { Count: > 0 })
            {
                foreach (var rt in user.RefreshTokens.Where(r => !r.IsRevoked && !r.IsExpired))
                    rt.RevokedAt = DateTime.UtcNow;
            }

            await _repo.SaveChangesAsync(ct);
            return true;
        }
    }
}
