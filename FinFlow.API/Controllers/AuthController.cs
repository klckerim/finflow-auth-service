using System.Security.Claims;
using Asp.Versioning;
using FinFlow.API.Models;
using FinFlow.Application.Commands.Users;
using FinFlow.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
        {
            try
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
            catch (OperationCanceledException e)
            {
                throw new Exception(e.Message, e);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var userId = await _mediator.Send(command, cancellationToken);
                _logger.LogInformation("User registered successfully with ID {UserId}", userId);
                return Ok(new { userId });
            }
            catch (OperationCanceledException e)
            {
                throw new Exception(e.Message, e);
            }
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
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var command = new RefreshTokenCommand(request.RefreshToken);

            var result = await _mediator.Send(command);

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
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand req, CancellationToken ct)
        {
            try
            {
                var demoEnabled = _config.GetValue<bool>("Demo:Enabled");

                var resetUrl = await _mediator.Send(req, ct);
                _logger.LogInformation("User registered successfully with ID {Email}", req.Email);

                if (demoEnabled)
                {
                    return Ok(new { message = "If an account exists, a reset link is generated.", resetUrl });
                }
            }
            catch (OperationCanceledException e)
            {
                throw new Exception(e.Message, e);
            }

            return Ok(new { message = "If an account exists, a reset link has been sent." });
        }


        [HttpGet("validate-reset-token")]
        public async Task<IActionResult> ValidateResetToken([FromQuery] string token, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest(new { valid = false });

            var entry = await _repo.GetValidResetTokenAsync(token, ct);
            if (entry is null) return Ok(new ValidateResetTokenCommand(false, null));

            return Ok(new ValidateResetTokenCommand(true, SecurityHelpers.MaskEmail(entry.User.Email)));
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand req, CancellationToken ct)
        {
            try
            {
                var resetUrl = await _mediator.Send(req, ct);
                return Ok(new { message = "Password has been reset." });
            }
            catch (OperationCanceledException e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }

}

