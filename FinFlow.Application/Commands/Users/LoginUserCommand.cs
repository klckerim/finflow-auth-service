using MediatR;

namespace FinFlow.Application.Commands.Users
{
    public record LoginUserCommand(string Email, string Password) : IRequest<string>;
}
