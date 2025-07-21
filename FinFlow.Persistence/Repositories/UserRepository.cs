using FinFlow.Application.Interfaces.Repositories;

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

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
    }
}
