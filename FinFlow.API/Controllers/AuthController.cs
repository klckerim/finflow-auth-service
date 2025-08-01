using System.Security.Claims;
using FinFlow.API.Models;
using FinFlow.Application.Commands.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace FinFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var command = new LoginUserCommand(request.Email, request.Password);

            var result = await _mediator.Send(command);

            SetRefreshTokenCookie(result.RefreshToken);

            return Ok(new AuthenticationResponse
            {
                UserId = result.User.Id,
                Email = result.User.Email,
                FullName = result.User.FullName,
                Role = result.User.Role.ToString(),
                Token = result.AccessToken
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Refresh token cookie’sini sil
            if (Request.Cookies.ContainsKey("refreshToken"))
            {
                Response.Cookies.Delete("refreshToken");
            }

            return Ok(new { message = "Logged out successfully" });
        }



        [Authorize]
        [HttpGet("mes")]
        public IActionResult GetMyProfiles()
        {
            // var email = User?.Identity?.Name;
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            return Ok(new { email });
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
                return Unauthorized(new { message = "Kullanıcı kimliği bulunamadı." });
                
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


    }
}
