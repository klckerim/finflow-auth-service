using FinFlow.Application.Models;
using MediatR;

public record RefreshTokenCommand(string RefreshToken) : IRequest<AuthenticationResult>;
