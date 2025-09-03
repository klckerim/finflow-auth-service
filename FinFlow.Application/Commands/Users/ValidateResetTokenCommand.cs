
using MediatR;

namespace FinFlow.Application.Commands.Users
{
    public record ValidateResetTokenCommand(bool Valid, string? EmailMasked) : IRequest<bool>;
}