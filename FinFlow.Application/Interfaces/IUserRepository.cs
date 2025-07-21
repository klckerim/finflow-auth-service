using FinFlow.Domain.Entities;

namespace FinFlow.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> ExistsByEmailAsync(string email);
        Task AddAsync(User user);
        // 
    }
}

