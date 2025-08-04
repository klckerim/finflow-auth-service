using FinFlow.Application.Interfaces;
using FinFlow.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;


namespace FinFlow.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly FinFlowDbContext _context;

        public UserRepository(FinFlowDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken)
        {
            return await _context.Users.AnyAsync(u => u.Email == email, cancellationToken);
        }

        public async Task AddAsync(User user, CancellationToken cancellationToken)
        {
            await _context.Users.AddAsync(user, cancellationToken);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
        {
            return await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        }

        public async Task<User?> GetByPasswordResetTokenAsync(string token, CancellationToken cancellationToken)
        {
            return await _context.Users
            .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.PasswordResetToken == token && u.PasswordResetTokenExpiry > DateTime.UtcNow, cancellationToken);
        }

        public async Task<User?> GetUserByRefreshTokenAsync(string token)
        {
            return await _context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.RefreshTokens.Any(rt => rt.Token == token));
        }

        public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
        {
            return await _context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.RefreshTokens.Any(rt => rt.Token == refreshToken && rt.IsActive));
        }

        public async Task UpdateAsync(RefreshToken refreshToken, CancellationToken cancellationToken)
        {
            try
            {
                // RefreshToken'ı doğrudan context'e ekle
                _context.RefreshTokens.Add(refreshToken);

                await _context.SaveChangesAsync();
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
