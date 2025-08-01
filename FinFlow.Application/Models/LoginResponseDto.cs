using FinFlow.Domain.Entities;

namespace FinFlow.Application.Models
{
    public class LoginResponseDto
    {
        // public LoginResponseDto() { }

        public LoginResponseDto(User user, string accessToken, string refreshToken, DateTime expiresAt)
        {
            AccessToken = accessToken;
            RefreshToken = refreshToken;
            ExpiresAt = expiresAt;
            User = user;
        }

        public User User { get; } = new User();
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }
}

