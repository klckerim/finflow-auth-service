using MediatR;
using FinFlow.Domain.Entities;
using FinFlow.Application.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace FinFlow.Application.Commands.Users
{
    public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, Guid>
    {
        private readonly IUserRepository _userRepository;
        private readonly IStripePaymentService _stripePaymentService;
        private readonly IPasswordHasher<User> _passwordHasher;

        public RegisterUserHandler(IUserRepository userRepository, IPasswordHasher<User> passwordHasher, IStripePaymentService stripePaymentService)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _stripePaymentService = stripePaymentService;
        }

        public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            if (await _userRepository.ExistsByEmailAsync(request.Email, cancellationToken))
            {
                throw new AppException(ErrorCodes.UserAlreadyExists, "User with this email already exists.");
            }

            var stripeCustomer = await _stripePaymentService.CreateStripeCustomer(request.Email);

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow,
                FullName = request.FullName,
                StripeCustomerId = stripeCustomer.StripeCustomerId
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            await _userRepository.AddAsync(user, cancellationToken);

            return user.Id;
        }
    }
}
