using Tiner.Entities;

namespace Tiner.Interfaces;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}