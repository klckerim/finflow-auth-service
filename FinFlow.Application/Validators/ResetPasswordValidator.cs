using FinFlow.Application.Commands.Users;
using FluentValidation;

public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.Password)
            .NotEmpty().WithErrorCode("password_required")
            .MinimumLength(8).WithErrorCode("password_min_length").WithState(_ => new { MinLength = 8 })
            .Matches("[A-Z]").WithErrorCode("password_uppercase_required")
            .Matches("[a-z]").WithErrorCode("password_lowercase_required")
            .Matches("[0-9]").WithErrorCode("password_number_required")
            .Matches("[^a-zA-Z0-9]").WithErrorCode("password_special_char_required");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithErrorCode("confirm_password_required")
            .Equal(x => x.Password).WithErrorCode("passwords_do_not_match");
    }
}
