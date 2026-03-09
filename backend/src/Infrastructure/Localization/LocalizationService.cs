using Domain.Interfaces;
using System.Globalization;

namespace Infrastructure.Localization;

/// <summary>
/// Infrastructure: Localization Service Implementation
/// Provides localization functionality with culture management
/// </summary>
public class LocalizationService : ILocalizationService
{
    private string _currentCulture;
    private readonly Dictionary<string, Dictionary<string, string>> _translations;

    public LocalizationService()
    {
        _currentCulture = "en";
        _translations = new Dictionary<string, Dictionary<string, string>>
        {
            ["en"] = EnglishTranslations.GetTranslations(),
            ["pt-BR"] = PortugueseTranslations.GetTranslations()
        };
    }

    public string GetCurrentCulture()
    {
        return _currentCulture;
    }

    public void SetCulture(string culture)
    {
        if (_translations.ContainsKey(culture))
        {
            _currentCulture = culture;
            CultureInfo.CurrentCulture = new CultureInfo(culture);
            CultureInfo.CurrentUICulture = new CultureInfo(culture);
        }
    }

    public string GetString(string key, string? culture = null)
    {
        var targetCulture = culture ?? _currentCulture;

        if (_translations.TryGetValue(targetCulture, out var translations))
        {
            if (translations.TryGetValue(key, out var value))
            {
                return value;
            }
        }

        // Fallback to English
        if (targetCulture != "en" && _translations["en"].TryGetValue(key, out var fallback))
        {
            return fallback;
        }

        return key; // Return key if translation not found
    }

    public string GetString(string key, object parameters, string? culture = null)
    {
        var template = GetString(key, culture);
        
        if (parameters == null)
            return template;

        // Replace parameters in template
        var properties = parameters.GetType().GetProperties();
        foreach (var prop in properties)
        {
            var value = prop.GetValue(parameters);
            template = template.Replace($"{{{prop.Name}}}", value?.ToString() ?? "");
        }

        return template;
    }

    public bool HasKey(string key, string? culture = null)
    {
        var targetCulture = culture ?? _currentCulture;
        return _translations.TryGetValue(targetCulture, out var translations) && 
               translations.ContainsKey(key);
    }
}
