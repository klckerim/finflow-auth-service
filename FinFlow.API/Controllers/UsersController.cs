using Microsoft.AspNetCore.Mvc;
using MediatR;
using FinFlow.Application.Commands.Users;
using System.Threading.Tasks;

namespace FinFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator)
        {
            _mediator = mediator;
        }


        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var userId = await _mediator.Send(command, cancellationToken);
                return Ok(new { userId });
            }
            catch (OperationCanceledException e)
            {
                return BadRequest(e.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
