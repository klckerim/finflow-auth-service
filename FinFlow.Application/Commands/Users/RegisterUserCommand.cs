// RegisterUserCommand.cs
using MediatR;

public record RegisterUserCommand(string Email, string Password) : IRequest<Guid>;
