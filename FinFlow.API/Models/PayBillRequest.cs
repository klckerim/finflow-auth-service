public record PayBillRequest(
    string Email,
    string BillId,
    decimal Amount,
    Guid? WalletId,
    Guid? CardId,
    string Currency,
    PaymentType PaymentType);
