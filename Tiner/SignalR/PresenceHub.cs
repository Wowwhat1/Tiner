using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Tiner.Extensions;

namespace Tiner.SignalR;

[Authorize]
public class PresenceHub(PresenceTracker preTracker) : Hub {
    public override async Task OnConnectedAsync()
    {
        if (Context.User?.GetUsername() == null) throw new HubException("Unauthorized user");

        var isOnl = await preTracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
        if(isOnl) await Clients.Others.SendAsync("UserIsOnline", Context.User?.GetUsername());

        var curUsers = await preTracker.GetOnlineUsers();
        await Clients.Caller.SendAsync("GetOnlineUsers", curUsers);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (Context.User?.GetUsername() == null) throw new HubException("Unauthorized user");

        var isOffline = await preTracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
        if (isOffline) await Clients.Others.SendAsync("UserIsOffline", Context.User?.GetUsername());

        await base.OnDisconnectedAsync(exception);
    }
}