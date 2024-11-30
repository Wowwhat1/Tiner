using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Identity;
using Tiner.Extensions;

namespace Tiner.Entities;

public class AppUser : IdentityUser<int>
{
    public DateOnly Dob { get; set; }
    public required string KnownAs { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public required string Gender { get; set; }
    public string? Introduction { get; set; }
    public string? LookingFor { get; set; }
    public string? Interests { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; } 
    public List<Photo> Photos { get; set; } = [];
    public List<MatchedUser> MatchedByUsers { get; set; } = [];
    public List<MatchedUser> UsersMatched { get; set; } = [];
    public List<Message> MessagesSent { get; set; } = [];
    public List<Message> MessagesReceived { get; set; } = [];
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
}