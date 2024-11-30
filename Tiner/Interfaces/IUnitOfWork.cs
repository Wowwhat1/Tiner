using Tiner.Extensions;

namespace Tiner.Interfaces;

public interface IUnitOfWork 
{
    IUserRepository UserRepository { get; }
    IMessageRepository MessageRepository { get; }
    IMatchedRepository MatchedRepository { get; }
    Task<bool> Complete();
    bool HasChanges();  
}