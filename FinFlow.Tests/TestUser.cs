using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinFlow.Tests;

/// Builds the ControllerContext an authenticated request would have after JWT validation.
internal static class TestUser
{
    public static ControllerContext Context(Guid? userId, string? email = "user@finflow.test")
    {
        var claims = new List<Claim>();
        if (userId is not null)
            claims.Add(new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString()));
        if (email is not null)
            claims.Add(new Claim(ClaimTypes.Email, email));

        return new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(new ClaimsIdentity(claims, "Test")) }
        };
    }
}
