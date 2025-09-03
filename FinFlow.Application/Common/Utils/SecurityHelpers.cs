using System.Security.Cryptography;

public static class SecurityHelpers
{
    public static string GenerateUrlSafeToken(int bytes = 32)
        => Convert.ToBase64String(RandomNumberGenerator.GetBytes(bytes))
            .Replace("+", "-").Replace("/", "_").Replace("=", "");

    public static string MaskEmail(string email)
    {
        var at = email.IndexOf('@');
        if (at <= 1) return "***";
        var name = email[..at];
        var domain = email[(at+1)..];
        var maskedName = name.Length <= 2 ? name[0] + "*" : name[0] + new string('*', name.Length-2) + name[^1];
        return $"{maskedName}@{domain}";
    }
}
