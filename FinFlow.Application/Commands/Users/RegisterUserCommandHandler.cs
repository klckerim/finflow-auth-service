using MediatR;
using FinFlow.Domain.Entities;
using FinFlow.Application.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace FinFlow.Application.Commands.Users
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Guid>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher<User> _passwordHasher;

        public RegisterUserCommandHandler(IUserRepository userRepository, IPasswordHasher<User> passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            if (await _userRepository.ExistsByEmailAsync(request.Email, cancellationToken))
            {
                throw new InvalidOperationException("User with this email already exists.");
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow,
                FullName = request.FullName
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            await _userRepository.AddAsync(user, cancellationToken);

            return user.Id;
        }
    }
}
