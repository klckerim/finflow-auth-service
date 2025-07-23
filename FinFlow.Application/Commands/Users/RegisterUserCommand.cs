using MediatR;
using System;

namespace FinFlow.Application.Commands.Users
{
    public record RegisterUserCommand(string Email, string Password) : IRequest<Guid>;
}

