using MediatR;
using Microsoft.AspNetCore.Identity;
using FinFlow.Application.Commands.Users;
using FinFlow.Application.Models;
using FinFlow.Domain.Entities;
using FinFlow.Application.Interfaces;


namespace FinFlow.Application.Auth.Handlers;

public class LoginUserHandler : IRequestHandler<LoginUserCommand, LoginResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ITokenService _tokenService;

    public LoginUserHandler(
        IUserRepository userRepository,
        IPasswordHasher<User> passwordHasher,
        ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<LoginResponseDto> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user is null)
            throw new AppException(ErrorCodes.InvalidCredentials, "");

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result != PasswordVerificationResult.Success)
            throw new AppException(ErrorCodes.InvalidCredentials, "");

        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken(user);

        // user.RefreshTokens.Add(refreshToken);

        await _userRepository.UpdateAsync(refreshToken, cancellationToken);


        return new LoginResponseDto(
            user,
            accessToken,
            refreshToken.Token,
            refreshToken.ExpiresAt
        );

    }
}
