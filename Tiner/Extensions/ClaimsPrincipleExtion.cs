using System.Security.Claims;

namespace Tiner.Extensions;

public static class ClaimsPrincipleExtion {
    public static string GetUsername(this ClaimsPrincipal user) {
        var username = user.FindFirstValue(ClaimTypes.Name);

        if (username == null)
        {
            throw new Exception("Cannot get username from token");
        }

        return username;
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)?? throw new Exception("Cannot get user id from token")) ;

        return userId;
    }
}