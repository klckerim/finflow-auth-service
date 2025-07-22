using MediatR;
using FinFlow.Domain.Entities;
using FinFlow.Application.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;


namespace FinFlow.Application.Commands.Users
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Guid>
    {
        private readonly IUserRepository _userRepository;

        public RegisterUserCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var userExists = await _userRepository.ExistsByEmailAsync(request.Email);
            if (userExists)
                throw new Exception("User already exists.");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user, cancellationToken);
            return user.Id;
        }

        private string HashPassword(string password)
        {
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
}
