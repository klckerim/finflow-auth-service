using MediatR;

namespace FinFlow.Application.Commands.Users
{
    public record ForgotPasswordCommand(string Email) : IRequest<string>;
}
