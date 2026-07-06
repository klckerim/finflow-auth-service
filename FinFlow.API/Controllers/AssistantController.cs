using System.Security.Claims;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class AssistantController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AssistantController> _logger;

    public AssistantController(IMediator mediator, ILogger<AssistantController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    // Resolves the caller's own userId from the JWT — never trusts a client-supplied id —
    // so the assistant can only ever answer questions about the authenticated user's own data.
    [HttpPost("ask")]
    [EnableRateLimiting("Assistant")]
    public async Task<IActionResult> Ask([FromBody] AskAssistantRequest request, CancellationToken cancellationToken)
    {
        var userIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdRaw, out var userId))
            return Unauthorized(new { message = "User ID not found." });

        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new { message = "Message is required." });

        var answer = await _mediator.Send(
            new AskAssistantCommand(userId, request.Message, request.History ?? new List<ChatMessageDto>()),
            cancellationToken);

        _logger.LogInformation("Assistant answered a question for user {UserId}", userId);

        return Ok(new { answer });
    }
}
