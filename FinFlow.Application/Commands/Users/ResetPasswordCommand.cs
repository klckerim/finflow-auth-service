using MediatR;

namespace FinFlow.Application.Commands.Users
{
    public record ResetPasswordCommand(string Email) : IRequest<bool>;
}
