using Domain.Constants;
using Domain.Interfaces;
using Domain.Models.Responses;
using System.Net;

namespace Api.Middleware;

/// <summary>
/// Catches unhandled exceptions from the pipeline and returns a consistent
/// ErrorResponseDto. Controllers no longer need generic catch(Exception) blocks.
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception for {Method} {Path}", context.Request.Method, context.Request.Path);
            await WriteErrorAsync(context, ex);
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, Exception ex)
    {
        var (status, errorCode, locKey) = ex switch
        {
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized,   "Unauthorized",    LocalizationKeys.Auth.InvalidCredentials),
            KeyNotFoundException        => (HttpStatusCode.NotFound,        "NotFound",        LocalizationKeys.Error.BadRequest),
            InvalidOperationException   => (HttpStatusCode.Conflict,        "InvalidOperation",LocalizationKeys.Error.BadRequest),
            ArgumentException           => (HttpStatusCode.BadRequest,      "InvalidData",     LocalizationKeys.Error.BadRequest),
            _                           => (HttpStatusCode.InternalServerError, "InternalError", LocalizationKeys.Error.InternalServer),
        };

        // Resolve localization service from the request scope
        var localization = context.RequestServices.GetService<ILocalizationService>();
        var message = localization?.GetString(locKey) ?? ex.Message;

        context.Response.StatusCode = (int)status;
        context.Response.ContentType = "application/json";

        var response = new ErrorResponseDto(message, errorCode, (int)status);
        await context.Response.WriteAsJsonAsync(response);
    }
}
