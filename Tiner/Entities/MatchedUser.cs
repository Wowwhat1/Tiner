namespace Tiner.Entities;

public class MatchedUser
{
    public AppUser SrcUser { get; set; } = null!;
    public int SrcUserId { get; set; }
    public AppUser TargetUser { get; set; } = null!;
    public int TargetUserId { get; set; }
}