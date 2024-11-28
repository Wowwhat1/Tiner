using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Helpers;
using Tiner.Interfaces;

namespace Tiner.Data.Repositories;

public class UserRepository(ApplicationDbContext context, IMapper mapper) : IUserRepository
{
    public async Task<PagedList<TinerDto>> GetTinerAsync(UserParams userParams)
    {
        var query = context.AppUsers.AsQueryable();

        query = query.Where(x => x.UserName != userParams.CurrentUsername);

        if (userParams.Gender != null)
        {
            query = query.Where(x => x.Gender == userParams.Gender);
        }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

        query = query.Where(x => x.Dob >= minDob && x.Dob <= maxDob);

        query = userParams.OrderBy switch
        {
            "createdOn" => query.OrderByDescending(x => x.CreatedOn),
            _ => query.OrderByDescending(x => x.LastActive)
        };

        return await PagedList<TinerDto>.CreateAsync(query.ProjectTo<TinerDto>(mapper.ConfigurationProvider), userParams.PageNumber, 
            userParams.PageSize);
    }

    public async Task<TinerDto?> GetTinerByNameAsync(string name)
    {
        return await context.AppUsers.Where(x => x.UserName == name)
            .ProjectTo<TinerDto>(mapper.ConfigurationProvider).SingleOrDefaultAsync();
    }

    public async Task<AppUser?> GetUserByIdAsync(int id)
    {
        return await context.AppUsers.FindAsync(id);
    }

    public async Task<AppUser> GetUserByUsernameAsync(string username)
    {
        return await context.AppUsers.Include(x => x.Photos)
            .SingleOrDefaultAsync(x => x.UserName == username);
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await context.AppUsers.Include(x => x.Photos).ToListAsync();
    }

    public async Task<bool> SaveAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void Update(AppUser user)
    {
        context.Entry(user).State = EntityState.Modified;
    }
}