using FluentValidation;

public class CreateWalletCommandValidator : AbstractValidator<CreateWalletCommand>
{
    public CreateWalletCommandValidator()
    {
        RuleFor(x => x.Balance)
    .GreaterThanOrEqualTo(0).WithErrorCode("wallet_balance_positive");

        RuleFor(x => x.Currency)
            .NotEmpty().WithErrorCode("wallet_currency_required")
            .Must(CurrencyCodes.IsSupported).WithErrorCode("wallet_currency_not_supported");

        RuleFor(x => x.Name)
            .NotEmpty().WithErrorCode("wallet_name_required")
            .MinimumLength(3).WithErrorCode("wallet_name_min_length").WithState(_ => new { MinLength = 3 })
            .MaximumLength(100).WithErrorCode("wallet_name_max_length").WithState(_ => new { MaxLength = 100 });
    }
}
