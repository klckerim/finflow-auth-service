using MediatR;
using Microsoft.Extensions.Configuration;

namespace FinFlow.Application.Commands.Users
{
    public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, string>
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;

        public ForgotPasswordHandler(IAuthRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config = config;
        }

        public async Task<string> Handle(ForgotPasswordCommand req, CancellationToken ct)
        {
            var user = await _repo.GetUserByEmailAsync(req.Email.Trim(), ct);

            var expiresMinutes = _config.GetValue<int?>("ResetPassword:ExpiryMinutes") ?? 30;

            if (user is not null)
            {
                var token = SecurityHelpers.GenerateUrlSafeToken();
                var reset = new ResetPasswordToken
                {
                    Token = token,
                    UserId = user.Id,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(expiresMinutes),
                    IsUsed = false
                };

                await _repo.AddResetPasswordTokenAsync(reset, ct);

                var requestHost = _config["FRONTEND_URLS"]
                ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)[0];

                var resetUrl = $"{requestHost}/reset-password/{token}";

                return resetUrl;
            }

            return string.Empty;
        }
    }
}
