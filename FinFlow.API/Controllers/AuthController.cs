using System.Security.Claims;
using Asp.Versioning;
using FinFlow.API.Models;
using FinFlow.Application.Commands.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace FinFlow.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<AuthController> _logger;
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;


        public AuthController(IMediator mediator, ILogger<AuthController> logger, IAuthRepository repo, IConfiguration config)
        {
            _mediator = mediator;
            _logger = logger;
            _config = config;
            _repo = repo;

        }

        [HttpPost("login")]
        [EnableRateLimiting("AuthSensitive")]
        public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
        {
            var command = new LoginUserCommand(request.Email, request.Password);

            var result = await _mediator.Send(command, cancellationToken);

            SetRefreshTokenCookie(result.RefreshToken);

            _logger.LogInformation("User {Email} logged in successfully.", request.Email);

            return Ok(new AuthenticationResponse
            {
                UserId = result.User.Id,
                Email = result.User.Email,
                FullName = result.User.FullName,
                Role = result.User.Role.ToString(),
                Token = result.AccessToken
            });
        }

        [HttpPost("register")]
        [EnableRateLimiting("AuthSensitive")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserCommand command, CancellationToken cancellationToken)
        {
            var userId = await _mediator.Send(command, cancellationToken);
            _logger.LogInformation("User registered successfully with ID {UserId}", userId);
            return Ok(new { userId });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Refresh token cookie’sini sil
            if (Request.Cookies.ContainsKey("refreshToken"))
            {
                Response.Cookies.Delete("refreshToken");
            }
            _logger.LogInformation("User logged out successfully.");

            return Ok(new { message = "Logged out successfully" });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetMyProfile()
        {

            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var fullName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User ID not found." });

            _logger.LogInformation("Retrieving profile for user {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));

            var response = new
            {
                UserId = userId,
                Email = email,
                FullName = fullName,
                Role = role
            };

            return Ok(response);
        }

        [HttpPost("refresh-token")]
        [EnableRateLimiting("AuthSensitive")]
        public async Task<IActionResult> RefreshToken(CancellationToken cancellationToken)
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
            {
                _logger.LogWarning("Refresh token cookie is missing.");
                return Unauthorized(new { message = "Refresh token is missing." });
            }

            var command = new RefreshTokenCommand(refreshToken);

            var result = await _mediator.Send(command, cancellationToken);
            // RefreshToken'ı HttpOnly cookie'ye yazalım
            SetRefreshTokenCookie(result.RefreshToken);

            _logger.LogInformation("Refresh token used for user {UserId}", result.User.Id);

            return Ok(new AuthenticationResponse
            {
                UserId = result.User.Id,
                Email = result.User.Email,
                FullName = result.User.FullName,
                Role = result.User.Role.ToString(),
                Token = result.Token
            });
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // HTTPS üzerinden gönderilecek
                Expires = DateTime.UtcNow.AddDays(7), // 7 gün geçerli
                SameSite = SameSiteMode.Lax // CSRF koruması için
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

        [HttpPost("forgot-password")]
        [EnableRateLimiting("AuthSensitive")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand req, CancellationToken ct)
        {
            var demoEnabled = _config.GetValue<bool>("Demo:Enabled");

            var resetUrl = await _mediator.Send(req, ct);
            _logger.LogInformation("Password reset requested for {Email}", req.Email);

            if (demoEnabled)
            {
                return Ok(new { message = "If an account exists, a reset link is generated.", resetUrl });
            }

            return Ok(new { message = "If an account exists, a reset link has been sent." });
        }


        [HttpGet("validate-reset-token")]
        [EnableRateLimiting("AuthSensitive")]
        public async Task<IActionResult> ValidateResetToken([FromQuery] string token, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest(new { valid = false });

            var entry = await _repo.GetValidResetTokenAsync(token, ct);
            if (entry is null) return Ok(new ValidateResetTokenCommand(false, null));

            return Ok(new ValidateResetTokenCommand(true, SecurityHelpers.MaskEmail(entry.User.Email)));
        }

        [HttpPost("reset-password")]
        [EnableRateLimiting("AuthSensitive")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand req, CancellationToken ct)
        {
            await _mediator.Send(req, ct);
            return Ok(new { message = "Password has been reset." });
        }
    }

}
