using FinFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinFlow.Infrastructure.Persistence.Configurations
{
    public class PaymentMethodConfiguration : IEntityTypeConfiguration<PaymentMethod>
    {
        public void Configure(EntityTypeBuilder<PaymentMethod> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.StripePaymentMethodId).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Brand).IsRequired().HasMaxLength(50);
            builder.Property(x => x.Last4).IsRequired().HasMaxLength(4);
            builder.Property(x => x.ExpMonth).IsRequired();
            builder.Property(x => x.ExpYear).IsRequired();
            builder.Property(x => x.CardHolderName).HasMaxLength(150);
            builder.Property(x => x.IsDefault).HasDefaultValue(false);
            builder.Property(x => x.CreatedAt).IsRequired();

            // Relationships
            builder.HasOne(x => x.User)
               .WithMany(u => u.PaymentMethods)
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Transactions)
                   .WithOne(t => t.PaymentMethod)
                   .HasForeignKey(t => t.PaymentMethodId)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
