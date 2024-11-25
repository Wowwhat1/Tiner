using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Tiner.Entities;

namespace Tiner.Data;

public class Seed() {
    public static async Task SeedData(ApplicationDbContext context)
    {
        if (await context.AppUsers.AnyAsync()) return;
        
        var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

        if (users == null) return;

        foreach (var user in users) {
            using var hmac = new HMACSHA512();
            user.UserName = user.UserName.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
            user.PasswordSalt = hmac.Key;

            context.AppUsers.Add(user);
        }

        await context.SaveChangesAsync();
    }
}