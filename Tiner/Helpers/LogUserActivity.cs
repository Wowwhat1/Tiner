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
        var unitOfWork = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>();
        if (unitOfWork == null) return;
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);

        if(user != null) {
            user.LastActive = DateTime.UtcNow;
            await unitOfWork.Complete();
        } else return;
    }
}