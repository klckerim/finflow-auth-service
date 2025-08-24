using FluentValidation;

public class TransferCommandValidator : AbstractValidator<TransferCommand>
{
    public TransferCommandValidator()
    {

        // Transfer Validation Rules
        RuleFor(x => x.FromWalletId)
            .NotEmpty().WithErrorCode("sender_wallet_required");

        RuleFor(x => x.ToWalletId)
            .NotEmpty().WithErrorCode("recipient_wallet_required");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithErrorCode("transfer_amount_positive").WithState(_ => new { MinAmount = 0 });

        RuleFor(x => x)
            .Must(x => x.FromWalletId != x.ToWalletId)
            .WithErrorCode("same_wallet_transfer");
    }
}
