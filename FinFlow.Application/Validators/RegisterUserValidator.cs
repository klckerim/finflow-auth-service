using FinFlow.Application.Commands.Users;
using FluentValidation;

public class RegisterUserValidator : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserValidator()
    {
        RuleFor(x => x.FullName)
       .NotEmpty().WithErrorCode("full_name_required")
       .MinimumLength(3).WithErrorCode("full_name_min_length").WithState(_ => new { MinLength = 3 })
       .MaximumLength(100).WithErrorCode("full_name_max_length").WithState(_ => new { MaxLength = 100 });

        RuleFor(x => x.Email)
            .NotEmpty().WithErrorCode("email_required")
            .EmailAddress().WithErrorCode("email_invalid");

        RuleFor(x => x.Password)
            .NotEmpty().WithErrorCode("password_required")
            .MinimumLength(8).WithErrorCode("password_min_length").WithState(_ => new { MinLength = 8 })
            .Matches("[A-Z]").WithErrorCode("password_uppercase_required")
            .Matches("[a-z]").WithErrorCode("password_lowercase_required")
            .Matches("[0-9]").WithErrorCode("password_number_required")
            .Matches("[^a-zA-Z0-9]").WithErrorCode("password_special_char_required");

    }
}
