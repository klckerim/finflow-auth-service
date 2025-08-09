using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransactionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Kullanıcı bazlı
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId, [FromQuery] int limit = 20)
    {
        var transactions = await _mediator.Send(new GetTransactionsByUserIdQuery(userId, limit));
        return Ok(transactions);
    }

    // Cüzdan bazlı
    [HttpGet("wallet/{walletId}")]
    public async Task<IActionResult> GetByWalletId(Guid walletId, [FromQuery] int limit = 20)
    {
        var transactions = await _mediator.Send(new GetTransactionsByWalletIdQuery(walletId, limit));
        return Ok(transactions);
    }
}
