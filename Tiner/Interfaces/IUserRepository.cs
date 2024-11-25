using Tiner.DTOs;
using Tiner.Entities;

namespace Tiner.Interfaces;

public interface IUserRepository
{
    void Update(AppUser user);
    Task<bool> SaveAsync();
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser?> GetUserByIdAsync(int id);
    Task<AppUser> GetUserByUsernameAsync(string username);
    Task<IEnumerable<TinerDto>> GetTinerAsync();
    Task<TinerDto?> GetTinerByNameAsync(string name);
}