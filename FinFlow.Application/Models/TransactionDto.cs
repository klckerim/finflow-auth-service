public class TransactionDto
{
    public Guid Id { get; set; }
    public Guid WalletId { get; set; }
    public decimal Amount { get; set; }
    public string? Type { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}
