using System.Text.Json;
using Tiner.Helpers;

namespace Tiner.Extensions;

public static class HttpExtension
{
    public static void AddPaginationHeader<T>(this HttpResponse response, PagedList<T> data)
    {
        var paginationHeader = new PaginationHelper(data.CurrentPage, data.PageSize, data.TotalCount, data.TotalPages);
        
        var jsonOpts = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        response.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader, jsonOpts));
        response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
    }
}