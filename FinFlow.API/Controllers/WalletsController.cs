using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class WalletsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<WalletsController> _logger;

    public WalletsController(IMediator mediator, ILogger<WalletsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWalletCommand command)
    {
        var walletId = await _mediator.Send(command);
        _logger.LogInformation("Wallet created successfully with ID {WalletId}", walletId);
        return CreatedAtAction(nameof(GetById), new { id = walletId }, new { walletId });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateWalletCommand command)
    {
        if (id != command.WalletId)
            throw new Exception("Wallet not found.");

        var success = await _mediator.Send(command);

        if (!success)
            return NotFound();

        _logger.LogInformation("Wallet with ID {WalletId} updated successfully.", id);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteWalletCommand(id));

        if (!result)
            return NotFound();

        _logger.LogInformation("Wallet with ID {WalletId} deleted successfully.", id);
        return NoContent();
    }


    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        var wallets = await _mediator.Send(new GetWalletsByUserIdQuery(userId));
        _logger.LogInformation("Retrieved {Count} wallets for user {UserId}", wallets.Count, userId);
        return Ok(wallets);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetWalletByIdQuery(id), cancellationToken);
        _logger.LogInformation("Retrieved wallet with ID {WalletId}", id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("{walletId}/deposit")]
    public async Task<IActionResult> Deposit(Guid walletId, [FromBody] DepositRequest request)
    {
        await _mediator.Send(new DepositCommand(walletId, request.Amount, request.Currency));
        _logger.LogInformation("Deposited {Amount} to wallet {WalletId}", request.Amount, walletId);
        return NoContent();
    }

    [HttpPost("{walletId}/transfer")]
    public async Task<IActionResult> Transfer(Guid walletId, [FromBody] TransferDto transferDto)
    {
        if (walletId != transferDto.FromWalletId)
            throw new Exception(ErrorCodes.WalletsNotMatch);

        await _mediator.Send(new TransferCommand(transferDto.FromWalletId, transferDto.ToWalletId, transferDto.Amount));
        _logger.LogInformation("Transferred {Amount} from wallet {FromWalletId} to wallet {ToWalletId}",
            transferDto.Amount, transferDto.FromWalletId, transferDto.ToWalletId);
        return NoContent();
    }
}
