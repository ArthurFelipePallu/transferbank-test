namespace Application.Options;

/// <summary>
/// Typed configuration for the OCR.space provider.
/// Bound from the "OcrSpace" section in appsettings.
/// </summary>
public sealed class OcrSpaceOptions
{
    public const string SectionName = "OcrSpace";

    public string ApiKey  { get; set; } = string.Empty;
    public string Language { get; set; } = "por";
    public string Engine   { get; set; } = "2";
}
