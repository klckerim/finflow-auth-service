using FinFlow.Application.Interfaces;
using FinFlow.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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
            var context = _contextFactory.CreateDbContext();
            return await context.Users.AnyAsync(u => u.Email == email, cancellationToken);
        }

        public async Task AddAsync(User user, CancellationToken cancellationToken)
        {
            var context = _contextFactory.CreateDbContext();

            await context.Users.AddAsync(user, cancellationToken);
            await context.SaveChangesAsync();
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
        {
            var context = _contextFactory.CreateDbContext();

            return await context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        }

        public async Task<User?> GetByPasswordResetTokenAsync(string token, CancellationToken cancellationToken)
        {
            var context = _contextFactory.CreateDbContext();

            return await context.Users
            .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.PasswordResetToken == token && u.PasswordResetTokenExpiry > DateTime.UtcNow, cancellationToken);
        }

        public async Task<User?> GetUserByRefreshTokenAsync(string token)
        {
            var context = _contextFactory.CreateDbContext();

            return await context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.RefreshTokens.Any(rt => rt.Token == token));
        }

        public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
        {
            var context = _contextFactory.CreateDbContext();

            return await context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.RefreshTokens.Any(rt => rt.Token == refreshToken && rt.IsActive));
        }

        public async Task UpdateAsync(RefreshToken refreshToken, CancellationToken cancellationToken)
        {
            try
            {
                var context = _contextFactory.CreateDbContext();

                // RefreshToken'ı doğrudan context'e ekle
                context.RefreshTokens.Add(refreshToken);

                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                var entry = ex.Entries.Single();
                var databaseValues = await entry.GetDatabaseValuesAsync();

                if (databaseValues == null)
                {
                    // Record was deleted
                    throw new Exception("The record was deleted by another user.");
                }
                else
                {
                    // Record was updated
                    entry.OriginalValues.SetValues(databaseValues);
                    // Retry the operation or inform the user
                }
            }



        }


    }
}
