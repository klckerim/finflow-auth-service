using FluentValidation;

public class TransferCommandValidator : AbstractValidator<TransferCommand>
{
    public TransferCommandValidator()
    {
        RuleFor(x => x.FromWalletId).NotEmpty().WithMessage("Sender wallet cannot be empty.");
        RuleFor(x => x.ToWalletId).NotEmpty().WithMessage("Recipient wallet id cannot be empty.");
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Transfer amount must be greater than zero.");
        RuleFor(x => x)
            .Must(x => x.FromWalletId != x.ToWalletId)
            .WithMessage("Sender and recipient wallet cannot be same.");
    }
}
