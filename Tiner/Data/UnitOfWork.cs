using Tiner.Extensions;
using Tiner.Interfaces;

namespace Tiner.Data;

public class UnitOfWork(ApplicationDbContext applicationDbContext, IUserRepository userRepository, 
    IMatchedRepository matchedRepository, IMessageRepository messageRepository) : IUnitOfWork
{
    public IUserRepository UserRepository => userRepository;

    public IMessageRepository MessageRepository => messageRepository;

    public IMatchedRepository MatchedRepository => matchedRepository;

    public async Task<bool> Complete()
    {
        return await applicationDbContext.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        return applicationDbContext.ChangeTracker.HasChanges();
    }
}