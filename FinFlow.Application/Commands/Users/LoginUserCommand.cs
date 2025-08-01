using FinFlow.Application.Models;
using MediatR;


namespace FinFlow.Application.Commands.Users
{
    public class LoginUserCommand : IRequest<LoginResponseDto>
    {

        public LoginUserCommand(string email, string password)
        {
            Email = email;
            Password = password;
        }

        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
