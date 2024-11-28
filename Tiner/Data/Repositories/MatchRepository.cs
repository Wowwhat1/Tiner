using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Tiner.Data;
using Tiner.DTOs;
using Tiner.Helpers;
using Tiner.Interfaces;

namespace Tiner.Entities;

public class MatchRepository(ApplicationDbContext context, IMapper mapper) : IMatchedRepository
{
    public void AddMatch(MatchedUser matchedUser)
    {
        context.MatchedUsers.Add(matchedUser);
    }

    public void DeleteMatch(MatchedUser matchedUser)
    {
        context.MatchedUsers.Remove(matchedUser);
    }

    public async Task<IEnumerable<int>> GetCurrentUserMatchedIds(int curUserId)
    {
        return await context.MatchedUsers
            .Where(x => x.SrcUserId == curUserId)
            .Select(x => x.TargetUserId)
            .ToListAsync();
    }

    public async Task<MatchedUser?> GetMatchedUser(int srcUserId, int targetUserId)
    {
        return await context.MatchedUsers.FindAsync(srcUserId, targetUserId);
    }

    public async Task<PagedList<TinerDto>> GetMatchedUsers(MatchParams matchParams)
    {
        var matches = context.MatchedUsers.AsQueryable();
        IQueryable<TinerDto> query;

        switch (matchParams.Pre)
        {
            case "match":
                query = matches.Where(x => x.SrcUserId == matchParams.UserId).Select(x => x.TargetUser)
                    .ProjectTo<TinerDto>(mapper.ConfigurationProvider);
                break;
            case "matchedBy":
                query = matches.Where(x => x.TargetUserId == matchParams.UserId).Select(x => x.SrcUser)
                    .ProjectTo<TinerDto>(mapper.ConfigurationProvider);
                break;
            default:
                var matchIds = await GetCurrentUserMatchedIds(matchParams.UserId);

                query = matches.Where(x => x.TargetUserId == matchParams.UserId && matchIds.Contains(x.SrcUserId))
                    .Select(x => x.SrcUser)
                    .ProjectTo<TinerDto>(mapper.ConfigurationProvider);
                break;
        }

        return await PagedList<TinerDto>.CreateAsync(query, matchParams.PageNumber, matchParams.PageSize);
    }

    public async Task<bool> SaveChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}