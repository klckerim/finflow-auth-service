using FluentValidation;

public class DepositCommandValidator : AbstractValidator<DepositCommand>
{
    public DepositCommandValidator()
    {
        RuleFor(x => x.WalletId)
    .NotEmpty().WithErrorCode("wallet_id_required");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithErrorCode("amount_greater_than_zero").WithState(_ => new { MinAmount = 0 });
    }
}
