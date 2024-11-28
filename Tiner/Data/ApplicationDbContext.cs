using Microsoft.EntityFrameworkCore;
using Tiner.Entities;

namespace Tiner.Data;

public class ApplicationDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<MatchedUser> MatchedUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<MatchedUser>()
            .HasKey(x => new { x.SrcUserId, x.TargetUserId });

        modelBuilder.Entity<MatchedUser>()
            .HasOne(x => x.SrcUser)
            .WithMany(x => x.UsersMatched)
            .HasForeignKey(x => x.SrcUserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MatchedUser>()
            .HasOne(x => x.TargetUser)
            .WithMany(x => x.MatchedByUsers)
            .HasForeignKey(x => x.TargetUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}