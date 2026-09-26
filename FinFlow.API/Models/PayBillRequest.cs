public record PayBillRequest(
    string BillId,
    decimal Amount,
    Guid? WalletId,
    Guid? CardId,
    string Currency,
    PaymentType PaymentType);
