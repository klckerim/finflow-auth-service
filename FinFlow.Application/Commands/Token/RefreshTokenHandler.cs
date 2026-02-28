using Microsoft.AspNetCore.Http;
using FinFlow.Application.Interfaces;
using FinFlow.Application.Models;
using FinFlow.Domain.Entities;
using MediatR;

namespace FinFlow.Application.Commands.Token;

public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, AuthenticationResult>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public RefreshTokenHandler(
        IUserRepository userRepository,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthenticationResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // 1. Refresh Token ile kullanıcıyı bul
        var user = await _userRepository.GetByRefreshTokenAsync(request.RefreshToken);

        if (user is null)
        {
            throw new AppException(ErrorCodes.InvalidRefreshToken, "Refresh token is invalid or expired.", StatusCodes.Status401Unauthorized);
        }

        // 2. Refresh Token'ı işaretle (revoked)
        await _userRepository.RevokeRefreshTokenAsync(request.RefreshToken, cancellationToken);

        // 3. Yeni JWT ve Refresh Token üret
        string newJwt = _jwtTokenGenerator.GenerateToken(user);
        var newRefreshToken = RefreshToken.Create(SecurityHelpers.GenerateUrlSafeToken());

        user.RefreshTokens.Add(newRefreshToken);

        // 4. Kullanıcıyı güncelle
        await _userRepository.AddRefreshTokenAsync(newRefreshToken, cancellationToken);

        // 5. Sonucu dön
        return new AuthenticationResult(user, newJwt, newRefreshToken.Token);
    }
}
