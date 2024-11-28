using System.Text.RegularExpressions;
using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Helpers;

namespace Tiner.Interfaces;

public interface IMatchedRepository
{
    Task<MatchedUser?> GetMatchedUser(int srcUserId, int targetUserId);
    Task<PagedList<TinerDto>> GetMatchedUsers(MatchParams matchParams);
    Task<IEnumerable<int>> GetCurrentUserMatchedIds(int curUserId);
    void DeleteMatch(MatchedUser matchedUser);
    void AddMatch(MatchedUser matchedUser);
    Task<bool> SaveChanges();
}