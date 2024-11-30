using Microsoft.AspNetCore.Mvc.Filters;
using Tiner.Extensions;
using Tiner.Interfaces;

namespace Tiner.Helpers;

public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();

        if (context.HttpContext.User.Identity?.IsAuthenticated != true)
        {
            return;
        }

        var userId = resultContext.HttpContext.User.GetUserId();
        var repo = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
        if (repo == null) return;
        var user = await repo.GetUserByIdAsync(userId);

        if(user != null) {
            user.LastActive = DateTime.UtcNow;
            await repo.SaveAsync();
        } else return;
    }
}