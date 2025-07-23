using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class WalletsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WalletsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWalletCommand command)
    {
        var walletId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = walletId }, new { walletId });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var wallet = await _mediator.Send(new GetWalletByIdQuery(id));
        if (wallet == null)
            return NotFound();

        return Ok(wallet);
    }


}
