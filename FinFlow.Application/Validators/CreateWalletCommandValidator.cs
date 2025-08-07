using FluentValidation;

public class CreateWalletCommandValidator : AbstractValidator<CreateWalletCommand>
{
    public CreateWalletCommandValidator()
    {
        RuleFor(x => x.Balance)
            .NotEmpty().WithMessage("Wallet balance is required.")
            .GreaterThan(0).WithMessage("Wallet balance must be greater than 0");
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Wallet name is required.")
            .MinimumLength(3).WithMessage("Wallet name must be at least 3 characters.")
            .MaximumLength(100).WithMessage("Wallet name must be at most 100 characters.");
    }
}
