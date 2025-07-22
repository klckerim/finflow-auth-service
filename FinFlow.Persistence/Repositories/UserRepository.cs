using FinFlow.Application.Interfaces;
using FinFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinFlow.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly FinFlowDbContext _context;

        public UserRepository(FinFlowDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task AddAsync(User user, CancellationToken cancellationToken)
        {
            await _context.Users.AddAsync(user, cancellationToken);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
