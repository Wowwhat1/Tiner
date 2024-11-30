using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Extensions;
using Tiner.Helpers;

namespace Tiner.Data.Repositories;

public class MessageRepository(ApplicationDbContext context, IMapper mapper) : IMessageRepository
{
    public void AddGroup(Group group)
    {
        context.Groups.Add(group);
    }

    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DelConnection(Connection connection)
    {
        context.Connections.Remove(connection);
    }

    public void DelMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Connection?> GetConnection(string connectionId)
    {
        return await context.Connections.FindAsync(connectionId);
    }

    public async Task<Group?> GetGroupForConnection(string connectionId)
    {
        return await context.Groups.Include(x => x.Connections)
            .Where(x => x.Connections.Any(c => c.ConnectionId == connectionId)).FirstOrDefaultAsync();
    }

    public async Task<Message> GetMessage(int id)
    {
        return await context.Messages.FindAsync(id);
    }

    public async Task<Group?> GetMessageGroup(string groupName)
    {
        return await context.Groups.Include(x => x.Connections).FirstOrDefaultAsync(x => x.Name == groupName);
    }

    public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
    {
        var query = context.Messages.OrderByDescending(m => m.CreatedAt).AsQueryable();

        query = messageParams.Container switch
        {
            "Inbox" => query.Where(u => u.ReceiverUsername == messageParams.Username && u.IsReceiverDeleted == false),
            "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username && u.IsSenderDeleted == false),
            _ => query.Where(u => u.Receiver.UserName == messageParams.Username && u.ReadAt == null && u.IsReceiverDeleted == false)
        };

        var message = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);

        return await PagedList<MessageDto>.CreateAsync(message, messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IEnumerable<MessageDto>> GetMessageThread(string curUsername, string receiverUsername)
    {
        var mess = await context.Messages
            .Where(m => m.Receiver.UserName == curUsername && m.Sender.UserName == receiverUsername && m.IsReceiverDeleted == false
                        || m.Receiver.UserName == receiverUsername && m.Sender.UserName == curUsername && m.IsSenderDeleted == false)
            .OrderBy(m => m.CreatedAt)
            .ProjectTo<MessageDto>(mapper.ConfigurationProvider)
            .ToListAsync();

        var unreadMess = mess.Where(m => m.ReceiverUsername == curUsername && m.ReadAt == null).ToList();

        if (unreadMess.Count != 0) {
            unreadMess.ForEach(m => m.ReadAt = DateTime.UtcNow);
            await context.SaveChangesAsync();
        }

        return mess;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}