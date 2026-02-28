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
            throw new AppException(ErrorCodes.WalletsNotMatch, "Route wallet ID does not match payload wallet ID.", StatusCodes.Status400BadRequest);

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
    public async Task<IActionResult> Deposit(
        Guid walletId,
        [FromBody] decimal amount,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey)
    {
        await _mediator.Send(new DepositCommand(walletId, amount, idempotencyKey));
        _logger.LogInformation("Deposited {Amount} to wallet {WalletId}", amount, walletId);
        return NoContent();
    }

    [HttpPost("{walletId}/transfer")]
    public async Task<IActionResult> Transfer(
        Guid walletId,
        [FromBody] TransferDto transferDto,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey)
    {
        if (walletId != transferDto.FromWalletId)
            throw new AppException(ErrorCodes.WalletsNotMatch, "Route wallet ID does not match source wallet ID.", StatusCodes.Status400BadRequest);

        await _mediator.Send(new TransferCommand(transferDto.FromWalletId, transferDto.ToWalletId, transferDto.Amount, idempotencyKey));
        _logger.LogInformation("Transferred {Amount} from wallet {FromWalletId} to wallet {ToWalletId}",
            transferDto.Amount, transferDto.FromWalletId, transferDto.ToWalletId);
        return NoContent();
    }
}
