using System.Security.Claims;

namespace Tiner.Extensions;

public static class ClaimsPrincipleExtion {
    public static string GetUsername(this ClaimsPrincipal user) {
        var username = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (username == null)
        {
            throw new Exception("Cannot get username from token");
        }

        return username;
    }
}