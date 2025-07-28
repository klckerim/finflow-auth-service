using FinFlow.Domain.Entities;

namespace FinFlow.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<bool> ExistsByEmailAsync(string email);
        Task AddAsync(User user, CancellationToken cancellationToken);
        Task<User?> GetByPasswordResetTokenAsync(string token);
        Task UpdateAsync(User user);
    }
}

