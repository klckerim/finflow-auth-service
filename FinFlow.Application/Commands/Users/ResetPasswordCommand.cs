using MediatR;

namespace FinFlow.Application.Commands.Users
{
    public record ResetPasswordCommand(string Token, string Password, string ConfirmPassword) : IRequest<bool>;
}
