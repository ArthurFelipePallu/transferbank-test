namespace Domain.Models.Responses;

/// <summary>
/// Result of an AI-based social contract analysis.
/// Mirrors the JSON structure returned by the AI provider.
/// </summary>
public sealed class DocumentAnalysisResponse
{
    public bool   IsValid         { get; set; }
    public double ConfidenceIndex { get; set; }
    public string Reason          { get; set; } = string.Empty;
    public Dictionary<string, CriterionScore> Criteria { get; set; } = new();
}

public sealed class CriterionScore
{
    public double Score  { get; set; }
    public double Weight { get; set; }
    public string Notes  { get; set; } = string.Empty;
}
