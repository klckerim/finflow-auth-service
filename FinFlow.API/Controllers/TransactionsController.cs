using System.Security.Claims;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<TransactionsController> _logger;
    private readonly IWalletRepository _walletRepository;
    private readonly IPaymentMethodRepository _paymentMethodRepository;

    public TransactionsController(
        IMediator mediator,
        ILogger<TransactionsController> logger,
        IWalletRepository walletRepository,
        IPaymentMethodRepository paymentMethodRepository)
    {
        _mediator = mediator;
        _logger = logger;
        _walletRepository = walletRepository;
        _paymentMethodRepository = paymentMethodRepository;
    }

    // Kullanıcı bazlı
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId, [FromQuery] int limit = 20)
    {
        var authenticatedUserId = GetAuthenticatedUserId();
        if (authenticatedUserId is null)
            return Unauthorized(new { message = "User ID not found." });

        if (userId != authenticatedUserId.Value)
            return Forbid();

        var transactions = await _mediator.Send(new GetTransactionsByUserIdQuery(userId, limit));
        _logger.LogInformation("Retrieved {Count} transactions for user {UserId}", transactions.Count, userId);
        return Ok(transactions);
    }

    // Cüzdan bazlı
    [HttpGet("wallet/{walletId}")]
    public async Task<IActionResult> GetByWalletId(Guid walletId, [FromQuery] int limit = 20)
    {
        var authenticatedUserId = GetAuthenticatedUserId();
        if (authenticatedUserId is null)
            return Unauthorized(new { message = "User ID not found." });

        var wallet = await _walletRepository.GetByIdAsync(walletId, CancellationToken.None);
        if (wallet == null)
            return NotFound();

        if (wallet.UserId != authenticatedUserId.Value)
            return Forbid();

        var transactions = await _mediator.Send(new GetTransactionsByWalletIdQuery(walletId, limit));
        _logger.LogInformation("Retrieved {Count} transactions for wallet {WalletId}", transactions.Count, walletId);
        return Ok(transactions);
    }

    [HttpGet("card/{cardId}")]
    public async Task<IActionResult> GetByCardId(Guid cardId, [FromQuery] int limit = 20)
    {
        var authenticatedUserId = GetAuthenticatedUserId();
        if (authenticatedUserId is null)
            return Unauthorized(new { message = "User ID not found." });

        var card = await _paymentMethodRepository.GetByIdAsync(cardId, CancellationToken.None);
        if (card == null)
            return NotFound();

        if (card.UserId != authenticatedUserId.Value)
            return Forbid();

        var transactions = await _mediator.Send(new GetTransactionsByCardIdQuery(cardId, limit));
        _logger.LogInformation("Retrieved {Count} transactions for card {CardId}", transactions.Count, cardId);
        return Ok(transactions);
    }

    private Guid? GetAuthenticatedUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdValue, out var userId) ? userId : null;
    }
}
