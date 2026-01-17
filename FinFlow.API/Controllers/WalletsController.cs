using System.Security.Claims;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class WalletsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<WalletsController> _logger;
    private readonly IWalletRepository _walletRepository;

    public WalletsController(IMediator mediator, ILogger<WalletsController> logger, IWalletRepository walletRepository)
    {
        _mediator = mediator;
        _logger = logger;
        _walletRepository = walletRepository;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWalletCommand command)
    {
        var userId = GetAuthenticatedUserId();
        if (userId is null)
            return Unauthorized(new { message = "User ID not found." });

        if (command.UserId != userId.Value)
            return Forbid();

        var walletId = await _mediator.Send(command);
        _logger.LogInformation("Wallet created successfully with ID {WalletId}", walletId);
        return CreatedAtAction(nameof(GetById), new { id = walletId }, new { walletId });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateWalletCommand command)
    {
        var userId = GetAuthenticatedUserId();
        if (userId is null)
            return Unauthorized(new { message = "User ID not found." });

        if (id != command.WalletId)
            throw new Exception("Wallet not found.");

        var wallet = await _walletRepository.GetByIdAsync(id, CancellationToken.None);
        if (wallet == null)
            return NotFound();

        if (wallet.UserId != userId.Value)
            return Forbid();

        var success = await _mediator.Send(command);

        if (!success)
            return NotFound();

        _logger.LogInformation("Wallet with ID {WalletId} updated successfully.", id);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetAuthenticatedUserId();
        if (userId is null)
            return Unauthorized(new { message = "User ID not found." });

        var wallet = await _walletRepository.GetByIdAsync(id, CancellationToken.None);
        if (wallet == null)
            return NotFound();

        if (wallet.UserId != userId.Value)
            return Forbid();

        var result = await _mediator.Send(new DeleteWalletCommand(id));

        if (!result)
            return NotFound();

        _logger.LogInformation("Wallet with ID {WalletId} deleted successfully.", id);
        return NoContent();
    }


    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        var authenticatedUserId = GetAuthenticatedUserId();
        if (authenticatedUserId is null)
            return Unauthorized(new { message = "User ID not found." });

        if (userId != authenticatedUserId.Value)
            return Forbid();

        var wallets = await _mediator.Send(new GetWalletsByUserIdQuery(userId));
        _logger.LogInformation("Retrieved {Count} wallets for user {UserId}", wallets.Count, userId);
        return Ok(wallets);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId is null)
            return Unauthorized(new { message = "User ID not found." });

        var wallet = await _walletRepository.GetByIdAsync(id, cancellationToken);
        if (wallet == null)
            return NotFound();

        if (wallet.UserId != userId.Value)
            return Forbid();

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
        var userId = GetAuthenticatedUserId();
        if (userId is null)
            return Unauthorized(new { message = "User ID not found." });

        var wallet = await _walletRepository.GetByIdAsync(walletId, CancellationToken.None);
        if (wallet == null)
            return NotFound();

        if (wallet.UserId != userId.Value)
            return Forbid();

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
        var userId = GetAuthenticatedUserId();
        if (userId is null)
            return Unauthorized(new { message = "User ID not found." });

        if (walletId != transferDto.FromWalletId)
            throw new Exception(ErrorCodes.WalletsNotMatch);

        var fromWallet = await _walletRepository.GetByIdAsync(transferDto.FromWalletId, CancellationToken.None);
        if (fromWallet == null)
            return NotFound();

        if (fromWallet.UserId != userId.Value)
            return Forbid();

        await _mediator.Send(new TransferCommand(transferDto.FromWalletId, transferDto.ToWalletId, transferDto.Amount, idempotencyKey));
        _logger.LogInformation("Transferred {Amount} from wallet {FromWalletId} to wallet {ToWalletId}",
            transferDto.Amount, transferDto.FromWalletId, transferDto.ToWalletId);
        return NoContent();
    }

    private Guid? GetAuthenticatedUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdValue, out var userId) ? userId : null;
    }
}
