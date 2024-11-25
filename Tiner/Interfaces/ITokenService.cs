using Tiner.Entities;

namespace Tiner.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user);
}