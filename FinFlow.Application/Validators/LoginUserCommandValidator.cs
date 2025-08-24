namespace FinFlow.Application.Validators;

using FinFlow.Application.Commands.Users;
using FluentValidation;

public class LoginUserCommandValidator : AbstractValidator<LoginUserCommand>
{
    public LoginUserCommandValidator()
    {
        RuleFor(x => x.Email)
    .NotEmpty().WithErrorCode("email_required")
    .EmailAddress().WithErrorCode("email_invalid");

        RuleFor(x => x.Password)
            .NotEmpty().WithErrorCode("password_required");
    }
}