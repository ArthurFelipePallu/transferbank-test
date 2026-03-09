namespace Domain.Interfaces;

/// <summary>
/// Port: Localization Service Interface
/// Defines the contract for localization operations
/// </summary>
public interface ILocalizationService
{
    /// <summary>
    /// Get localized string for a key
    /// </summary>
    string GetString(string key, string? culture = null);

    /// <summary>
    /// Get localized string with parameters
    /// </summary>
    string GetString(string key, object parameters, string? culture = null);

    /// <summary>
    /// Check if a key exists
    /// </summary>
    bool HasKey(string key, string? culture = null);

    /// <summary>
    /// Get current culture
    /// </summary>
    string GetCurrentCulture();

    /// <summary>
    /// Set current culture
    /// </summary>
    void SetCulture(string culture);
}
