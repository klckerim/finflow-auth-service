
namespace FinFlow.Domain.Entities;

public class RefreshToken
{
    public static RefreshToken Create(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            throw new ArgumentException("Refresh token cannot be empty.", nameof(token));
        }

        var now = DateTime.UtcNow;

        return new RefreshToken
        {
            Token = token,
            ExpiresAt = now.AddDays(7),
            Created = now,
        };
    }

    public Guid Id { get; set; } = Guid.NewGuid();
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime? RevokedAt { get; set; }
    public bool IsRevoked => RevokedAt.HasValue;
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => !IsRevoked && !IsExpired;
}
