using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;

namespace FinFlow.Tests;

/// Secure-by-default guard: every API action must require authentication unless it is on the
/// explicit allowlist below. A new endpoint without [Authorize] fails this test instead of
/// silently shipping as public.
public class EndpointAuthorizationConventionTests
{
    private static readonly HashSet<string> AnonymousEndpoints =
    [
        "AuthController.Login",
        "AuthController.RegisterUser",
        "AuthController.Logout",
        "AuthController.RefreshToken",
        "AuthController.ForgotPassword",
        "AuthController.ValidateResetToken",
        "AuthController.ResetPassword",
        // Authenticated by the Stripe-Signature header, not a JWT.
        "PaymentsController.Webhook",
    ];

    public static TheoryData<string> AllEndpoints()
    {
        var data = new TheoryData<string>();
        foreach (var (controller, action) in Endpoints())
            data.Add($"{controller.Name}.{action.Name}");
        return data;
    }

    [Theory]
    [MemberData(nameof(AllEndpoints))]
    public void Endpoint_ShouldRequireAuthentication_UnlessExplicitlyAllowlisted(string endpoint)
    {
        var (controller, action) = Endpoints().Single(e => $"{e.Controller.Name}.{e.Action.Name}" == endpoint);

        var allowsAnonymous = action.IsDefined(typeof(AllowAnonymousAttribute), inherit: true)
            || controller.IsDefined(typeof(AllowAnonymousAttribute), inherit: true);
        var requiresAuth = !allowsAnonymous
            && (action.IsDefined(typeof(AuthorizeAttribute), inherit: true)
                || controller.IsDefined(typeof(AuthorizeAttribute), inherit: true));

        if (AnonymousEndpoints.Contains(endpoint))
            Assert.False(requiresAuth, $"{endpoint} is allowlisted as anonymous but requires auth; remove it from the allowlist.");
        else
            Assert.True(requiresAuth, $"{endpoint} is reachable without a JWT. Add [Authorize] or, if it must be public, allowlist it here.");
    }

    [Fact]
    public void Allowlist_ShouldOnlyNameExistingEndpoints()
    {
        var existing = Endpoints().Select(e => $"{e.Controller.Name}.{e.Action.Name}").ToHashSet();

        Assert.Empty(AnonymousEndpoints.Except(existing));
    }

    private static IEnumerable<(Type Controller, MethodInfo Action)> Endpoints() =>
        typeof(WalletsController).Assembly.GetTypes()
            .Where(t => typeof(ControllerBase).IsAssignableFrom(t) && !t.IsAbstract)
            .SelectMany(t => t.GetMethods(BindingFlags.Instance | BindingFlags.Public | BindingFlags.DeclaredOnly)
                .Where(m => m.IsDefined(typeof(HttpMethodAttribute), inherit: true))
                .Select(m => (t, m)));
}
