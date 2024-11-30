using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Helpers;

namespace Tiner.Extensions;

public interface IMessageRepository
{
    void AddMessage(Message message);
    void DelMessage(Message message);
    Task<Message> GetMessage(int id);
    Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams);
    Task<IEnumerable<MessageDto>> GetMessageThread(string curUsername, string receiverUsername);
    Task<bool> SaveAllAsync();
    void AddGroup(Group group);
    void DelConnection(Connection connection);
    Task<Connection?> GetConnection(string connectionId);
    Task<Group?> GetMessageGroup(string groupName);
    Task<Group?> GetGroupForConnection(string connectionId);
}