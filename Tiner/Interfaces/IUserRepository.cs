using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Helpers;

namespace Tiner.Interfaces;

public interface IUserRepository
{
    void Update(AppUser user);
    Task<bool> SaveAsync();
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser?> GetUserByIdAsync(int id);
    Task<AppUser> GetUserByUsernameAsync(string username);
    Task<PagedList<TinerDto>> GetTinerAsync(UserParams userParams);
    Task<TinerDto?> GetTinerByNameAsync(string name);
}