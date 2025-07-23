using FluentValidation;

public class TransferCommandValidator : AbstractValidator<TransferCommand>
{
    public TransferCommandValidator()
    {
        RuleFor(x => x.FromWalletId).NotEmpty().WithMessage("Gönderen cüzdan ID'si boş olamaz.");
        RuleFor(x => x.ToWalletId).NotEmpty().WithMessage("Alıcı cüzdan ID'si boş olamaz.");
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Transfer edilecek tutar sıfırdan büyük olmalıdır.");
        RuleFor(x => x)
            .Must(x => x.FromWalletId != x.ToWalletId)
            .WithMessage("Gönderen ve alıcı cüzdanlar aynı olamaz.");
    }
}
