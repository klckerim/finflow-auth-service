using System.Globalization;

public static class CurrencyCodes
{
    private static readonly HashSet<string> Supported = new(StringComparer.OrdinalIgnoreCase)
    {
        "EUR",
        "USD",
        "TRY"
    };

    public static bool IsSupported(string? currency)
    {
        if (string.IsNullOrWhiteSpace(currency))
        {
            return false;
        }

        return Supported.Contains(currency.Trim());
    }

    public static string Normalize(string? currency)
    {
        return (currency ?? string.Empty).Trim().ToUpper(CultureInfo.InvariantCulture);
    }
}
