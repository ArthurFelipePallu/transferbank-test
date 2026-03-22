namespace Application.Options;

/// <summary>
/// Typed configuration for the OpenAI provider.
/// Bound from the "OpenAi" section in appsettings.
/// </summary>
public sealed class OpenAiOptions
{
    public const string SectionName = "OpenAi";

    public string ApiKey    { get; set; } = string.Empty;
    public string Model     { get; set; } = "gpt-4o-mini";
    public int    MaxTokens { get; set; } = 600;
}
