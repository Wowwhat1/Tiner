using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Tiner.Data.Repositories;
using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Extensions;
using Tiner.Interfaces;

namespace Tiner.SignalR;

public class MessageHub(IUnitOfWork unitOfWork, IMapper mapper, IHubContext<PresenceHub> preHub) : Hub
{
    public override async Task OnConnectedAsync()
    {
        try
        {
            var httpContext = Context.GetHttpContext();
            var user = httpContext?.Request.Query["user"];

            if (Context.User == null || string.IsNullOrWhiteSpace(user))
            {
                throw new HubException("User or target user is missing.");
            }

            var groupName = GetGroupName(Context.User.GetUsername(), user);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group = await AddToGroup(groupName);

            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await unitOfWork.MessageRepository.GetMessageThread(Context.User.GetUsername(), user!);

            if (unitOfWork.HasChanges()) await unitOfWork.Complete();
            Console.WriteLine($"Messages for {Context.User.GetUsername()} with {user}: {messages.Count()}");
            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"OnConnectedAsync Exception: {ex.Message}");
            throw; // This ensures the client receives the exception reason
        }
    }


    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var group = await DelFromMessGroup();
        await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
        await base.OnDisconnectedAsync(exception);
    }

    private string GetGroupName(string caller, string? other)
    {
        var stringCompare = string.CompareOrdinal(caller, other) < 0;

        return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
    }

    private async Task<Group> AddToGroup(string groupName)
    {
        var username = Context.User?.GetUsername() ?? throw new Exception("User not found");
        var group = await unitOfWork.MessageRepository.GetMessageGroup(groupName);
        var connection = new Connection{ ConnectionId = Context.ConnectionId, Username = username };

        if (group == null)
        {
            group = new Group { Name = groupName };
            unitOfWork.MessageRepository.AddGroup(group);
        }

        group.Connections.Add(connection);

        if (await unitOfWork.Complete()) return group;

        throw new HubException("Failed to join group");
    }

    private async Task<Group> DelFromMessGroup() {
        var group = await unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
        var connection = group?.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);

        if (connection != null && group != null) {
            unitOfWork.MessageRepository.DelConnection(connection);
            if (await unitOfWork.Complete()) return group;
        }

        throw new HubException("Failed to remove from group");
    }

    public async Task SendMessage(CreateMessDto createMessDto) {
        var username = Context.User?.GetUsername() ?? throw new Exception("User not found");

        if (username == createMessDto.ReceiverUsername.ToLower()) throw new HubException("You cannot send messages to yourself");

        var sender = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        var receiver = await unitOfWork.UserRepository.GetUserByUsernameAsync(createMessDto.ReceiverUsername);

        if (receiver == null || sender == null || sender.UserName == null || receiver.UserName == null)
            throw new HubException("Cannot send message now");

        var message = new Message
        {
            Sender = sender,
            Receiver = receiver,
            SenderUsername = sender.UserName,
            ReceiverUsername = receiver.UserName,
            Content = createMessDto.Content
        };

        var groupName = GetGroupName(sender.UserName, receiver.UserName);
        var group = await unitOfWork.MessageRepository.GetMessageGroup(groupName);

        if (group != null && group.Connections.Any(x => x.Username == receiver.UserName))
        {
            message.ReadAt = DateTime.UtcNow;
        } else {
            var connections = await PresenceTracker.GetConnectionsForUser(receiver.UserName);
            if (connections != null && connections?.Count != null)
            {
                await preHub.Clients.Clients(connections).SendAsync("NewMessageReceived", 
                new { username = sender.UserName, knownAs = sender.KnownAs });
            }
        }

        unitOfWork.MessageRepository.AddMessage(message);

        if (await unitOfWork.Complete()) {
            await Clients.Group(groupName).SendAsync("NewMessage", mapper.Map<MessageDto>(message));
        }
    }
}