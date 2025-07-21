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
        public async Task<IActionResult> Register(RegisterUserCommand command)
        {
            try
            {
                var userId = await _mediator.Send(command);
                return Ok(new { UserId = userId });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
