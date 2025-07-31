using Microsoft.EntityFrameworkCore;
using FinFlow.Domain.Entities;

namespace FinFlow.Infrastructure.Persistence
{
    public class FinFlowDbContext : DbContext
    {
        public FinFlowDbContext(DbContextOptions<FinFlowDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Wallet> Wallets => Set<Wallet>();
        public DbSet<Transaction> Transactions => Set<Transaction>();
        public DbSet<ResetPasswordToken> ResetPasswordTokens => Set<ResetPasswordToken>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(FinFlowDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }
}
