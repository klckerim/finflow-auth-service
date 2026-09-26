using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// Saved cards are only visible to their owner; another user's card id returns 404.
[ApiController]
[Authorize]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class CardsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IResourceOwnershipService _ownership;
    private readonly ILogger<CardsController> _logger;

    public CardsController(IMediator mediator, IResourceOwnershipService ownership, ILogger<CardsController> logger)
    {
        _mediator = mediator;
        _ownership = ownership;
        _logger = logger;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        if (User.GetUserId() is not { } callerId)
            return Unauthorized();
        if (callerId != userId)
            return Forbid();

        var cards = await _mediator.Send(new GetPaymentMethodByUserIdQuery(userId));
        _logger.LogInformation("Retrieved {Count} cards for user {UserId}", cards.Count, userId);
        return Ok(cards);
    }


    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        if (User.GetUserId() is not { } callerId || !await _ownership.OwnsPaymentMethodAsync(callerId, id, cancellationToken))
            return NotFound();

        var result = await _mediator.Send(new GetPaymentMethodByIdQuery(id), cancellationToken);
        _logger.LogInformation("Retrieved card with ID {CardID}", id);
        return result is null ? NotFound() : Ok(result);
    }

}
