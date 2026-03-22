using Domain.Models.Responses;

namespace Application.Interfaces;

/// <summary>
/// Port: analyzes extracted document text and returns a structured validation result.
/// Implementations live in Infrastructure.
/// </summary>
public interface IDocumentAnalysisService
{
    Task<DocumentAnalysisResponse> AnalyzeAsync(string extractedText);
}
