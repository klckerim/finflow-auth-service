
namespace FinFlow.Infrastructure.Persistence.Configurations;

using FinFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Amount).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(x => x.Description).HasMaxLength(500);
        builder.Property(x => x.CreatedAt).IsRequired();

        // Relationships
        builder.HasOne(x => x.Wallet)
               .WithMany(x => x.Transactions)
               .HasForeignKey(x => x.WalletId)
               .OnDelete(DeleteBehavior.Cascade);

    }
}