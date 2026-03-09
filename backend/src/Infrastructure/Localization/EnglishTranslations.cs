namespace Infrastructure.Localization;

public static class EnglishTranslations
{
    public static Dictionary<string, string> GetTranslations()
    {
        return new Dictionary<string, string>
        {
            // Validation errors
            ["Validation.Required"] = "{field} is required",
            ["Validation.Email"] = "Invalid email format",
            ["Validation.MinLength"] = "{field} must be at least {min} characters",
            ["Validation.MaxLength"] = "{field} must be at most {max} characters",
            ["Validation.InvalidFormat"] = "Invalid {field} format",

            // Authentication
            ["Auth.InvalidCredentials"] = "Invalid email or password",
            ["Auth.SessionExpired"] = "Your session has expired. Please login again.",
            ["Auth.Unauthorized"] = "You are not authorized to perform this action",

            // Company errors
            ["Company.AlreadyExists"] = "Company with this CNPJ or Email already exists",
            ["Company.NotFound"] = "Company not found. Please check the company ID.",
            ["Company.InvalidCnpj"] = "Invalid CNPJ format",
            ["Company.NoCryptocurrencies"] = "At least one cryptocurrency must be selected",

            // Partner errors
            ["Partner.AlreadyExists"] = "Partner with this CPF already exists",
            ["Partner.NotFound"] = "Partner not found. Please check the partner ID.",
            ["Partner.InvalidCpf"] = "Invalid CPF format",
            ["Partner.InvalidShareholding"] = "Shareholding must be between 0.01 and 100",
            ["Partner.ShareholdingExceeded"] = "Total shareholding cannot exceed 100%",

            // Generic errors
            ["Error.InternalServer"] = "An error occurred. Please try again.",
            ["Error.NotFound"] = "Resource not found",
            ["Error.BadRequest"] = "Invalid request. Please check your input.",
            ["Error.Conflict"] = "This resource already exists",
            ["Error.Forbidden"] = "Access denied",

            // Success messages
            ["Success.CompanyRegistered"] = "Company registered successfully",
            ["Success.PartnerRegistered"] = "Partner registered successfully",
            ["Success.LoginSuccessful"] = "Login successful",
        };
    }
}
