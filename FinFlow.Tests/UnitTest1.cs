using FinFlow.Domain.Entities;

namespace FinFlow.Tests;

public class RefreshTokenTests
{
    [Fact]
    public void Create_ShouldInitializeActiveToken()
    {
        var token = RefreshToken.Create();

        Assert.False(token.IsExpired);
        Assert.False(token.IsRevoked);
        Assert.True(token.IsActive);
        Assert.NotEqual(Guid.Empty, token.Id);
        Assert.False(string.IsNullOrWhiteSpace(token.Token));
        Assert.True(token.ExpiresAt > token.Created);
    }
}
