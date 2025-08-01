using FinFlow.Domain.Entities;

namespace FinFlow.Application.Models;


public class AuthenticationResult
{
    public User User { get; }
    public string Token { get; }
    public string RefreshToken { get; }

    public AuthenticationResult(User user, string token, string refreshToken)
    {
        User = user;
        Token = token;
        RefreshToken = refreshToken;
    }
}