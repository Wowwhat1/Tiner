namespace Tiner.SignalR;

public class PresenceTracker {
    private static readonly Dictionary<string, List<string>> OnlineUsers = new Dictionary<string, List<string>>();

    public Task<bool> UserConnected(string username, string connectionId) {
        var isOnl = false;

        lock (OnlineUsers) {
            if (OnlineUsers.ContainsKey(username)) {
                OnlineUsers[username].Add(connectionId);
            } else {
                OnlineUsers.Add(username, new List<string> { connectionId });
                isOnl = true;
            }
        }

        return Task.FromResult(isOnl);
    }

    public Task<bool> UserDisconnected(string username, string connectionId) {
        var isOffline = false;

        lock (OnlineUsers) {
            if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);

            OnlineUsers[username].Remove(connectionId);

            if (OnlineUsers[username].Count == 0) {
                OnlineUsers.Remove(username);
                isOffline = true;
            }
        }

        return Task.FromResult(isOffline);
    }

    public Task<string[]> GetOnlineUsers() {
        string[] onlineUsers;
        lock (OnlineUsers) {
            onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
        }

        return Task.FromResult(onlineUsers);
    }

    public static Task<List<string>> GetConnectionsForUser(string username) {
        List<string> connectionsIds;
        if (OnlineUsers.TryGetValue(username, out var connections)) {
            lock (connections) {
                connectionsIds = connections.ToList();
            }
        } else {
            connectionsIds = [];
        }

        return Task.FromResult(connectionsIds);
    }
}