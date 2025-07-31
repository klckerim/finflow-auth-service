
namespace FinFlow.Infrastructure.Persistence.Configurations;

using FinFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class WalletConfiguration : IEntityTypeConfiguration<Wallet>
{
    public void Configure(EntityTypeBuilder<Wallet> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Balance).HasColumnType("decimal(18,2)").HasDefaultValue(0);
        
        // Relationships
        builder.HasOne(x => x.User)
               .WithMany(x => x.Wallets)
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}