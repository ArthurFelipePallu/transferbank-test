namespace Domain.Constants;

/// <summary>
/// Compile-time constants for all localization resource keys.
/// Prevents silent failures from typos in string literals.
/// </summary>
public static class LocalizationKeys
{
    public static class Error
    {
        public const string InternalServer = "Error.InternalServer";
        public const string BadRequest     = "Error.BadRequest";
    }

    public static class Auth
    {
        public const string InvalidCredentials = "Auth.InvalidCredentials";
    }

    public static class Company
    {
        public const string AlreadyExists = "Company.AlreadyExists";
        public const string NotFound      = "Company.NotFound";
    }

    public static class Partner
    {
        public const string NotFound             = "Partner.NotFound";
        public const string ShareholdingExceeded = "Partner.ShareholdingExceeded";
    }
}
