using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// Every action is scoped to the JWT user: wallets are only created for the caller, and any
// wallet id from the route or body must belong to the caller. A wallet that exists but belongs
// to someone else returns 404, the same as a missing one, so ids can't be probed.
[ApiController]
[Authorize]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class WalletsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IResourceOwnershipService _ownership;
    private readonly ILogger<WalletsController> _logger;

    public WalletsController(IMediator mediator, IResourceOwnershipService ownership, ILogger<WalletsController> logger)
    {
        _mediator = mediator;
        _ownership = ownership;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWalletCommand command)
    {
        if (User.GetUserId() is not { } callerId)
            return Unauthorized();

        // The owner always comes from the token; a userId in the body is ignored.
        var walletId = await _mediator.Send(command with { UserId = callerId });
        _logger.LogInformation("Wallet created successfully with ID {WalletId}", walletId);
        return CreatedAtAction(nameof(GetById), new { id = walletId }, new { walletId });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateWalletCommand command)
    {
        if (id != command.WalletId)
            throw new AppException(ErrorCodes.WalletsNotMatch, "Route wallet ID does not match payload wallet ID.", StatusCodes.Status400BadRequest);

        if (!await CallerOwnsWalletAsync(id, HttpContext.RequestAborted))
            return NotFound();

        var success = await _mediator.Send(command);

        if (!success)
            return NotFound();

        _logger.LogInformation("Wallet with ID {WalletId} updated successfully.", id);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (!await CallerOwnsWalletAsync(id, HttpContext.RequestAborted))
            return NotFound();

        var result = await _mediator.Send(new DeleteWalletCommand(id));

        if (!result)
            return NotFound();

        _logger.LogInformation("Wallet with ID {WalletId} deleted successfully.", id);
        return NoContent();
    }


    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        if (User.GetUserId() is not { } callerId)
            return Unauthorized();
        if (callerId != userId)
            return Forbid();

        var wallets = await _mediator.Send(new GetWalletsByUserIdQuery(userId));
        _logger.LogInformation("Retrieved {Count} wallets for user {UserId}", wallets.Count, userId);
        return Ok(wallets);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        if (!await CallerOwnsWalletAsync(id, cancellationToken))
            return NotFound();

        var result = await _mediator.Send(new GetWalletByIdQuery(id), cancellationToken);
        _logger.LogInformation("Retrieved wallet with ID {WalletId}", id);
        return result is null ? NotFound() : Ok(result);
    }

    // There is intentionally no direct deposit endpoint: it credited any amount without a
    // payment behind it. Deposits go through Stripe Checkout (POST /api/payments/create-session)
    // and are applied by the signature-verified webhook.

    [HttpPost("{walletId}/transfer")]
    public async Task<IActionResult> Transfer(
        Guid walletId,
        [FromBody] TransferDto transferDto,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey)
    {
        if (walletId != transferDto.FromWalletId)
            throw new AppException(ErrorCodes.WalletsNotMatch, "Route wallet ID does not match source wallet ID.", StatusCodes.Status400BadRequest);

        // Only the source wallet must be the caller's; the destination may belong to anyone.
        if (!await CallerOwnsWalletAsync(transferDto.FromWalletId, HttpContext.RequestAborted))
            return NotFound();

        await _mediator.Send(new TransferCommand(transferDto.FromWalletId, transferDto.ToWalletId, transferDto.Amount, idempotencyKey));
        _logger.LogInformation("Transferred {Amount} from wallet {FromWalletId} to wallet {ToWalletId}",
            transferDto.Amount, transferDto.FromWalletId, transferDto.ToWalletId);
        return NoContent();
    }

    private async Task<bool> CallerOwnsWalletAsync(Guid walletId, CancellationToken cancellationToken) =>
        User.GetUserId() is { } callerId && await _ownership.OwnsWalletAsync(callerId, walletId, cancellationToken);
}
