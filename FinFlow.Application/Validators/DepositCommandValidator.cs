using FluentValidation;

public class DepositCommandValidator : AbstractValidator<DepositCommand>
{
    public DepositCommandValidator()
    {
        RuleFor(x => x.WalletId).NotEmpty().WithMessage("WalletId boş olamaz.");
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Yatırılacak tutar sıfırdan büyük olmalıdır.");
    }
}
