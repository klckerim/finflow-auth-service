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

        public DbSet<User> Users { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<ResetPasswordToken> ResetPasswordTokens { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Entity Config
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                      .ValueGeneratedNever(); // Guid PK, identity değil
                // İstersen ekstra alanlar burada konfigüre edilir
            });

            // Wallet Entity Config
            modelBuilder.Entity<Wallet>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                      .ValueGeneratedNever();
            });

            // Transaction Entity Config
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                      .ValueGeneratedNever();
            });
        }
    }
}
