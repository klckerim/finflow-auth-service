using FinFlow.Domain.Entities;

namespace FinFlow.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
    string GenerateAccessToken(Guid userId, string email);
    string GenerateRefreshToken(Guid userId, string email);
    DateTime GetAccessTokenExpiration();
    DateTime GetRefreshTokenExpiration();
}
