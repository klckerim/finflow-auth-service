using FinFlow.Application.Interfaces;
using FinFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace FinFlow.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IDbContextFactory<FinFlowDbContext> _contextFactory;

        public UserRepository(IDbContextFactory<FinFlowDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken)
        {
            using var context = _contextFactory.CreateDbContext();
            return await context.Users.AnyAsync(u => u.Email == email, cancellationToken);
        }

        public async Task AddAsync(User user, CancellationToken cancellationToken)
        {
            using var context = _contextFactory.CreateDbContext();

            await context.Users.AddAsync(user, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
        {
            using var context = _contextFactory.CreateDbContext();

            return await context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        }

        public async Task<User?> GetByPasswordResetTokenAsync(string token, CancellationToken cancellationToken)
        {
            using var context = _contextFactory.CreateDbContext();

            return await context.Users
            .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.PasswordResetToken == token && u.PasswordResetTokenExpiry > DateTime.UtcNow, cancellationToken);
        }

        public async Task<User?> GetUserByRefreshTokenAsync(string token)
        {
            using var context = _contextFactory.CreateDbContext();

            return await context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.RefreshTokens.Any(rt => rt.Token == token));
        }

        public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
        {
            using var context = _contextFactory.CreateDbContext();

            return await context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.RefreshTokens.Any(rt => rt.Token == refreshToken && rt.IsActive));
        }

        public async Task AddRefreshTokenAsync(RefreshToken refreshToken, CancellationToken cancellationToken)
        {
            using var context = _contextFactory.CreateDbContext();

            context.RefreshTokens.Add(refreshToken);

            await context.SaveChangesAsync(cancellationToken);
        }

        public async Task RevokeRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken)
        {
            using var context = _contextFactory.CreateDbContext();
            var token = await context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken, cancellationToken);
            if (token == null)
            {
                return;
            }

            token.RevokedAt = DateTime.UtcNow;
            await context.SaveChangesAsync(cancellationToken);
        }


    }
}
