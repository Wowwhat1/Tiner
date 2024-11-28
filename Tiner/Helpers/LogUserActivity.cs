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

        var username = resultContext.HttpContext.User.GetUsername();
        var repo = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
        var user = await repo.GetUserByUsernameAsync(username);

        if(user != null) {
            user.LastActive = DateTime.UtcNow;
            await repo.SaveAsync();
        } else return;
    }
}