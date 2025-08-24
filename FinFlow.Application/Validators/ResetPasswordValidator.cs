using FinFlow.Application.Commands.Users;
using FluentValidation;

public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.Email)
   .NotEmpty().WithErrorCode("email_required")
   .EmailAddress().WithErrorCode("email_invalid");
    }
}
