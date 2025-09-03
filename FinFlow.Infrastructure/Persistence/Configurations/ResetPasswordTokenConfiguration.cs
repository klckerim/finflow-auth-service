using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ResetPasswordTokenConfiguration : IEntityTypeConfiguration<ResetPasswordToken>
{
    public void Configure(EntityTypeBuilder<ResetPasswordToken> b)
    {
        b.HasKey(x => x.Id);
        b.Property(x => x.Token).IsRequired().HasMaxLength(256);
        b.Property(x => x.ExpiresAt).IsRequired();
        b.Property(x => x.IsUsed).HasDefaultValue(false);

        b.HasIndex(x => x.Token).IsUnique();
        b.HasOne(x => x.User)
         .WithMany()
         .HasForeignKey(x => x.UserId)
         .OnDelete(DeleteBehavior.Cascade);
    }
}
