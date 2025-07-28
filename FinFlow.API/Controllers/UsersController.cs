using Microsoft.AspNetCore.Mvc;
using MediatR;
using FinFlow.Application.Commands.Users;

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

        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ResetPasswordCommand request)
        {
            // Basit validasyon
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest(new { message = "Email is required" });

            // Sahte token üretelim
            var token = Guid.NewGuid().ToString();

            // Gerçekte burada email gönderilir ama şimdilik simüle ediyoruz
            return Ok(new { token });
        }
    }
}
