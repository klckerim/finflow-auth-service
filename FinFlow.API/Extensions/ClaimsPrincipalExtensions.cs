using System.Security.Claims;

public static class ClaimsPrincipalExtensions
{
    /// The authenticated user's id from the JWT `sub` claim (mapped to NameIdentifier),
    /// or null when the principal carries no valid id.
    public static Guid? GetUserId(this ClaimsPrincipal user) =>
        Guid.TryParse(user.FindFirstValue(ClaimTypes.NameIdentifier), out var userId) ? userId : null;

    public static string? GetEmail(this ClaimsPrincipal user) =>
        user.FindFirstValue(ClaimTypes.Email) ?? user.FindFirstValue(ClaimTypes.Name);
}
