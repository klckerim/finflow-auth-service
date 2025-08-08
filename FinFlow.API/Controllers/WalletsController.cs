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

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateWalletCommand command)
    {
        if (id != command.WalletId)
            throw new Exception("Wallet not found.");

        var success = await _mediator.Send(command);

        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteWalletCommand(id));

        if (!result)
            return NotFound();

        return NoContent();
    }


    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        var wallets = await _mediator.Send(new GetWalletsByUserIdQuery(userId));
        return Ok(wallets);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetWalletByIdQuery(id), cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("{walletId}/deposit")]
    public async Task<IActionResult> Deposit(Guid walletId, [FromBody] decimal amount)
    {
        await _mediator.Send(new DepositCommand(walletId, amount));
        return NoContent();
    }

    [HttpPost("{walletId}/transfer")]
    public async Task<IActionResult> Transfer(Guid walletId, [FromBody] TransferDto transferDto)
    {
        if (walletId != transferDto.FromWalletId)
            throw new Exception("Wallet informations do not match.");

        await _mediator.Send(new TransferCommand(transferDto.FromWalletId, transferDto.ToWalletId, transferDto.Amount));
        return NoContent();
    }
}
