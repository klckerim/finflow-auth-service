using System.Security.Claims;
using FinFlow.Domain.Entities;

namespace FinFlow.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    RefreshToken GenerateRefreshToken(User user);
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
