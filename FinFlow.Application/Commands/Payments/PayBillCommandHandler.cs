using FinFlow.Application.Interfaces;
using FinFlow.Domain.Entities;
using MediatR;

public class PayBillCommandHandler : IRequestHandler<PayBillCommand, Guid>
{
    private readonly IWalletRepository _walletRepo;
    private readonly IPaymentMethodRepository _paymentMethodRepo;
    private readonly IUserRepository _userRepository;
    private readonly ITransactionRepository _txRepo;
    private readonly IStripePaymentService _stripe;

    public PayBillCommandHandler(IWalletRepository walletRepo,
                                 ITransactionRepository txRepo,
                                 IStripePaymentService stripe,
                                 IPaymentMethodRepository paymentMethodRepo,
                                 IUserRepository userRepository)
    {
        _walletRepo = walletRepo;
        _txRepo = txRepo;
        _stripe = stripe;
        _paymentMethodRepo = paymentMethodRepo;
        _userRepository = userRepository;
    }

    public async Task<Guid> Handle(PayBillCommand request, CancellationToken ct)
    {
        // Wallet payment
        if (request.PaymentType == PaymentType.Wallet && request.WalletId.HasValue)
        {
            var wallet = await _walletRepo.GetByIdAsync(request.WalletId.Value, ct);
            if (wallet == null)
                throw new AppException(ErrorCodes.WalletNotFound, "Wallet not found.");

            if (wallet.Balance < request.Amount)
                throw new AppException(ErrorCodes.InsufficientBalance, "Insufficient wallet balance");

            wallet.Balance -= request.Amount;
            await _walletRepo.UpdateAsync(wallet);

            await _txRepo.AddAsync(new Transaction
            {
                WalletId = wallet.Id,
                Amount = request.Amount,
                Currency = wallet.Currency,
                Type = TransactionType.BillPayment,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow
            });

            return Guid.NewGuid();
        }

        // Card payment
        if (request.PaymentType == PaymentType.Card && request.CardId.HasValue)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email, ct);
            if (user is null)
                throw new AppException(ErrorCodes.UserNotFound, "");

            var card = await _paymentMethodRepo.GetByIdAsync(request.CardId.Value, ct);
            if (card is null)
                throw new AppException(ErrorCodes.NoPaymentMethodProvided, "");

            if (!string.IsNullOrEmpty(user.StripeCustomerId) && !string.IsNullOrEmpty(card.StripePaymentMethodId))
            {
                var paymentResult = await _stripe.ConfirmPaymentAsync(user.StripeCustomerId, card.StripePaymentMethodId, request.Amount, request.Currency);

                if (!paymentResult.Succeeded)
                    throw new AppException(ErrorCodes.CardPaymentFailed, "Card payment failed");

                await _txRepo.AddAsync(new Transaction
                {
                    PaymentMethodId = request.CardId,
                    Amount = request.Amount,
                    Currency = request.Currency,
                    Type = TransactionType.BillPayment,
                    Description = request.Description,
                    CreatedAt = DateTime.UtcNow
                });

                return Guid.NewGuid();
            }
        }

        throw new AppException(ErrorCodes.NoPaymentMethodProvided, "No payment method provided");
    }


}
