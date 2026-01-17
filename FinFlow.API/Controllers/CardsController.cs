using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class CardsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<TransactionsController> _logger;

    public CardsController(IMediator mediator, ILogger<TransactionsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        var cards = await _mediator.Send(new GetPaymentMethodByUserIdQuery(userId));
        _logger.LogInformation("Retrieved {Count} cards for user {UserId}", cards.Count, userId);
        return Ok(cards);
    }


    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetPaymentMethodByIdQuery(id), cancellationToken);
        _logger.LogInformation("Retrieved card with ID {CardID}", id);
        return result is null ? NotFound() : Ok(result);
    }

}
