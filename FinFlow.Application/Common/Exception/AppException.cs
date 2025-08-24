public class AppException : Exception
{
    public string ErrorCode { get; }
    public int StatusCode { get; }
    public Dictionary<string, object>? Params { get; }

    public AppException(
        string errorCode, 
        string message = "", 
        int statusCode = 400,
        Dictionary<string, object>? parameters = null
    ) : base(message)
    {
        ErrorCode = errorCode;
        StatusCode = statusCode;
        Params = parameters;
    }
}
