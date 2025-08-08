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
                throw new Exception(e.Message, e);
            }
        }

        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ResetPasswordCommand request)
        {
            // Basit validasyon
            if (string.IsNullOrEmpty(request.Email))
                throw new Exception("Email is required");

            // Sahte token üretelim
            var token = Guid.NewGuid().ToString();

            // Gerçekte burada email gönderilir ama şimdilik simüle ediyoruz
            return Ok(new { token });
        }
    }
}
