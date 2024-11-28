namespace Tiner.Helpers;

public class PaginationHelper(int curPage, int itemsPerPage, int totalItems, int totalPages) {
    public int CurrentPage { get; set; } = curPage;
    public int TotalPages { get; set; } = totalPages;
    public int PageSize { get; set; } = itemsPerPage;
    public int TotalCount { get; set; } = totalItems;
}