using FinFlow.Application.Commands.Users;
using FinFlow.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using FinFlow.Infrastructure.Persistence;
using FinFlow.Infrastructure.Persistence.Repositories;
using FluentValidation;
using FinFlow.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using FinFlow.Domain.Entities;
using FinFlow.Infrastructure.Authentication;
using Serilog;
using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------
// Configuration & Services
// ------------------------------

// DbContext
builder.Services.AddDbContextFactory<FinFlowDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories & Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IWalletRepository, WalletRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IPaymentMethodRepository, PaymentMethodRepository>();
builder.Services.AddScoped<IStripePaymentService, StripePaymentService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();

// MediatR
builder.Services.AddMediatR(typeof(RegisterUserHandler).Assembly);

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// Controllers
builder.Services.AddControllers();

// Rate limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.OnRejected = async (context, token) =>
    {
        if (context.HttpContext.Response.HasStarted) return;

        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";

        var response = new ErrorResponse
        {
            Title = "Rate limit exceeded. Please try again later.",
            ErrorCode = ErrorCodes.RateLimitExceeded,
            Status = StatusCodes.Status429TooManyRequests,
            Params = new Dictionary<string, object>
            {
                ["retryAfterSeconds"] = 60
            }
        };

        await context.HttpContext.Response.WriteAsJsonAsync(response, cancellationToken: token);
    };

    options.AddPolicy("AuthSensitive", context =>
    RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: $"{context.Connection.RemoteIpAddress?.ToString() ?? "unknown"}:auth",
        factory: _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0
        }));

    options.AddPolicy("Payments", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: $"{context.Connection.RemoteIpAddress}:{context.Request.Path.Value?.ToLowerInvariant()}",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));

    options.AddPolicy("StripeWebhook", context =>
    RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        factory: _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 120,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0
        }));
});

// FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(RegisterUserValidator).Assembly);

// Pipeline Behaviors
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

// Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .WriteTo.File("logs/finflow-.log", rollingInterval: RollingInterval.Day)
    .WriteTo.Seq(builder.Configuration["Seq:Url"] ?? "http://localhost:5341")
    .CreateLogger();

builder.Host.UseSerilog();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT key is not configured. Please set 'Jwt:Key' in your configuration.");
}
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ClockSkew = TimeSpan.Zero
    };
});

// CORS
var allowedOrigins = builder.Configuration["FRONTEND_URLS"]
    ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// API Explorer & Versioning
builder.Services.AddEndpointsApiExplorer();

builder.Services
    .AddApiVersioning(options =>
    {
        options.DefaultApiVersion = new ApiVersion(1, 0);
        options.AssumeDefaultVersionWhenUnspecified = true;
        options.ReportApiVersions = true;
        options.ApiVersionReader = ApiVersionReader.Combine(
            new UrlSegmentApiVersionReader(),
            new HeaderApiVersionReader("x-api-version")
        );
    })
    .AddApiExplorer(options =>
    {
        options.GroupNameFormat = "'v'VVV";
        options.SubstituteApiVersionInUrl = true;
    });

// Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
              new OpenApiSecurityScheme
              {
                  Reference = new OpenApiReference
                  {
                      Type=ReferenceType.SecurityScheme,
                      Id="Bearer"
                  }
              },
              new string[]{}
        }
    });
});

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;

    options.ForwardLimit = 1;

    // Deploy için kullandığım Render gibi platformlarda KnownProxies sabit olmayabilir.
    // Bu yüzden burada KnownProxies eklemiyoruz.
});



var app = builder.Build();

// ------------------------------
// Middleware Pipeline
// ------------------------------

if (app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<FinFlowDbContext>();
    db.Database.Migrate();
}

var stripeKey = builder.Configuration["Stripe:SecretKey"];
Stripe.StripeConfiguration.ApiKey = stripeKey;

if (app.Environment.IsDevelopment())
{
    var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();

    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        foreach (var desc in provider.ApiVersionDescriptions)
        {
            options.SwaggerEndpoint($"/swagger/{desc.GroupName}/swagger.json",
                $"FinFlow API {desc.GroupName.ToUpperInvariant()}");
        }
        options.RoutePrefix = "swagger";
    });
}


// Root endpoint (health check için)
app.MapGet("/", () => Results.Ok("FinFlow API is running 🚀"));

app.UseForwardedHeaders();
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowFrontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
