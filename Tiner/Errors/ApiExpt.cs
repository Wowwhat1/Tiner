namespace Tiner.Errors;

public class ApiExpt(int statusCode, string mes, string? detail) {
    public int StatusCode { get; set; } = statusCode;
    public string Message { get; set; } = mes;
    public string? Detail { get; set; } = detail;
}