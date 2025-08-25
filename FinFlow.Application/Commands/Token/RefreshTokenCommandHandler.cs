using FinFlow.Application.Interfaces;
using FinFlow.Application.Models;
using FinFlow.Domain.Entities;
using MediatR;

namespace FinFlow.Application.Commands.Token;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthenticationResult>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public RefreshTokenCommandHandler(
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
            throw new Exception(ErrorCodes.InvalidRefreshToken);
        }

        // 2. Refresh Token'ı işaretle (revoked)
        var token = user.RefreshTokens.First(rt => rt.Token == request.RefreshToken);
        token.RevokedAt = DateTime.UtcNow;

        // 3. Yeni JWT ve Refresh Token üret
        string newJwt = _jwtTokenGenerator.GenerateToken(user);
        var newRefreshToken = RefreshToken.Create(); // static factory method olabilir

        user.RefreshTokens.Add(newRefreshToken);

        // 4. Kullanıcıyı güncelle
        await _userRepository.UpdateAsync(newRefreshToken, cancellationToken);

        // 5. Sonucu dön
        return new AuthenticationResult(user, newJwt, newRefreshToken.Token);
    }
}
