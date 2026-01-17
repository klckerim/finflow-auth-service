using System.Security.Claims;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class CardsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<TransactionsController> _logger;
    private readonly IPaymentMethodRepository _paymentMethodRepository;

    public CardsController(
        IMediator mediator,
        ILogger<TransactionsController> logger,
        IPaymentMethodRepository paymentMethodRepository)
    {
        _mediator = mediator;
        _logger = logger;
        _paymentMethodRepository = paymentMethodRepository;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        var authenticatedUserId = GetAuthenticatedUserId();
        if (authenticatedUserId is null)
            return Unauthorized(new { message = "User ID not found." });

        if (userId != authenticatedUserId.Value)
            return Forbid();

        var cards = await _mediator.Send(new GetPaymentMethodByUserIdQuery(userId));
        _logger.LogInformation("Retrieved {Count} cards for user {UserId}", cards.Count, userId);
        return Ok(cards);
    }


    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var authenticatedUserId = GetAuthenticatedUserId();
        if (authenticatedUserId is null)
            return Unauthorized(new { message = "User ID not found." });

        var card = await _paymentMethodRepository.GetByIdAsync(id, cancellationToken);
        if (card == null)
            return NotFound();

        if (card.UserId != authenticatedUserId.Value)
            return Forbid();

        var result = await _mediator.Send(new GetPaymentMethodByIdQuery(id), cancellationToken);
        _logger.LogInformation("Retrieved card with ID {CardID}", id);
        return result is null ? NotFound() : Ok(result);
    }

    private Guid? GetAuthenticatedUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdValue, out var userId) ? userId : null;
    }
}
