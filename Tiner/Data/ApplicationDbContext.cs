using Microsoft.EntityFrameworkCore;
using Tiner.Entities;

namespace Tiner.Data;

public class ApplicationDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> AppUsers { get; set; }
}