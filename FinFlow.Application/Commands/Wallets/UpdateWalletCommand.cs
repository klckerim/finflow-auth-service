using MediatR;

public class UpdateWalletCommand : IRequest<bool>
{
    public Guid WalletId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Balance { get; set; }
}
