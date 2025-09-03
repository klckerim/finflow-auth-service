using FinFlow.Application.Commands.Users;
using FluentValidation;

public class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordCommandValidator()
    {
        RuleFor(x => x.Email)
          .NotEmpty().WithErrorCode("email_required")
          .EmailAddress().WithErrorCode("email_invalid");
    }
}