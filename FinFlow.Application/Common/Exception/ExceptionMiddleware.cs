using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred.");
            context.Response.ContentType = "application/json";

            var response = new ErrorResponse
            {
                Title = ex.Message,
                ErrorCode = ex switch
                {
                    AppException appEx => appEx.ErrorCode,
                    ValidationException validationException=> ErrorCodes.ValidationFailed,
                    KeyNotFoundException => ErrorCodes.UserNotFound,
                    InvalidOperationException => ErrorCodes.InvalidCredentials,
                    _ => ErrorCodes.InternalServerError
                },
                Status = ex switch
                {
                    AppException appEx => appEx.StatusCode,
                    ValidationException => StatusCodes.Status400BadRequest,
                    KeyNotFoundException => StatusCodes.Status404NotFound,
                    InvalidOperationException => StatusCodes.Status400BadRequest,
                    _ => StatusCodes.Status500InternalServerError
                },
                Params = ex is AppException exception ? exception.Params : null
            };

            if (ex is ValidationException validationEx)
            {
                response.Errors = validationEx.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.ErrorCode).ToArray()
                );

                response.Params = validationEx.Errors
                    .Where(e => e.CustomState != null)
                    .ToDictionary(
                        e => e.PropertyName,
                        e => e.CustomState!
                );

            }

            context.Response.StatusCode = response.Status;
            await context.Response.WriteAsJsonAsync(response);
        }
    }
}

public class ErrorResponse
{
    public string Title { get; set; } = "";
    public string ErrorCode { get; set; } = "";
    public int Status { get; set; }
    public Dictionary<string, string[]>? Errors { get; set; }
    public Dictionary<string, object>? Params { get; set; }
}
