using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<TransactionsController> _logger;

    public TransactionsController(IMediator mediator, ILogger<TransactionsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    // Kullanıcı bazlı
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId, [FromQuery] int limit = 20)
    {
        var transactions = await _mediator.Send(new GetTransactionsByUserIdQuery(userId, limit));
        _logger.LogInformation("Retrieved {Count} transactions for user {UserId}", transactions.Count, userId);
        return Ok(transactions);
    }

    // Cüzdan bazlı
    [HttpGet("wallet/{walletId}")]
    public async Task<IActionResult> GetByWalletId(Guid walletId, [FromQuery] int limit = 20)
    {
        var transactions = await _mediator.Send(new GetTransactionsByWalletIdQuery(walletId, limit));
        _logger.LogInformation("Retrieved {Count} transactions for wallet {WalletId}", transactions.Count, walletId);
        return Ok(transactions);
    }
}
