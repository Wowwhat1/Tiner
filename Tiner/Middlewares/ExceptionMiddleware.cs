using System.Net;
using System.Text.Json;
using Tiner.Errors;

namespace Tiner.Middlewares;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try {
            await next(context);
        } catch(Exception ex) {
            logger.LogError(ex, ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

            var response = env.IsDevelopment()
                ? new ApiExpt(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                : new ApiExpt(context.Response.StatusCode, "Internal Server Error", null);

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }
    }
}