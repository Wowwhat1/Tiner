namespace Tiner.Helpers;

public class MatchParams : PaginationParams {
    public int UserId { get; set; }
    public required string Pre { get; set; } = "match";
}