using Domain.Interfaces;

namespace Api.Middleware;

/// <summary>
/// Middleware: Localization
/// Sets culture based on Accept-Language header
/// </summary>
public class LocalizationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string[] _supportedCultures = { "en", "pt-BR" };

    public LocalizationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ILocalizationService localizationService)
    {
        var acceptLanguage = context.Request.Headers["Accept-Language"].ToString();
        
        if (!string.IsNullOrEmpty(acceptLanguage))
        {
            // Parse Accept-Language header (e.g., "pt-BR,pt;q=0.9,en;q=0.8")
            var culture = ParseAcceptLanguage(acceptLanguage);
            
            if (!string.IsNullOrEmpty(culture) && _supportedCultures.Contains(culture))
            {
                localizationService.SetCulture(culture);
            }
        }

        await _next(context);
    }

    private string? ParseAcceptLanguage(string acceptLanguage)
    {
        // Split by comma and get first language
        var languages = acceptLanguage.Split(',');
        
        if (languages.Length == 0)
            return null;

        // Get first language and remove quality value if present
        var firstLanguage = languages[0].Split(';')[0].Trim();

        // Check if it's a supported culture
        if (_supportedCultures.Contains(firstLanguage))
            return firstLanguage;

        // Try to match base language (e.g., "pt" from "pt-BR")
        var baseLang = firstLanguage.Split('-')[0];
        return _supportedCultures.FirstOrDefault(c => c.StartsWith(baseLang));
    }
}
