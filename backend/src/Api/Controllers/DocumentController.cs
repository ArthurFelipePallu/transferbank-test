using Application.Interfaces;
using Infrastructure.ExternalServices;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// HTTP adapter for document processing (OCR + AI analysis).
/// Delegates all logic to Application services — contains no business rules.
/// </summary>
[ApiController]
[Route("api/document")]
public class DocumentController : ControllerBase
{
    private readonly IOcrService              _ocrService;
    private readonly IDocumentAnalysisService _analysisService;

    public DocumentController(IOcrService ocrService, IDocumentAnalysisService analysisService)
    {
        _ocrService      = ocrService;
        _analysisService = analysisService;
    }

    // ── POST /api/document/extract-text ──────────────────────────────────────

    [HttpPost("extract-text")]
    [RequestSizeLimit(15 * 1024 * 1024)]
    public async Task<IActionResult> ExtractText(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new DocumentErrorResponse("invalid_file", "No file provided."));

        try
        {
            using var stream = file.OpenReadStream();
            var text = await _ocrService.ExtractTextAsync(stream, file.FileName);
            return Ok(new { text });
        }
        catch (OcrServiceException ex)
        {
            var source = ex.Kind == OcrErrorKind.Unreadable ? "ocr_unreadable" : "ocr_api";
            return StatusCode(422, new DocumentErrorResponse(source, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(502, new DocumentErrorResponse("ocr_api", $"OCR service unreachable: {ex.Message}"));
        }
    }

    // ── POST /api/document/analyze ────────────────────────────────────────────

    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze([FromBody] AnalyzeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.Text))
            return BadRequest(new DocumentErrorResponse("invalid_input", "Text is required."));

        try
        {
            var result = await _analysisService.AnalyzeAsync(request.Text);
            return Ok(result);
        }
        catch (AiServiceException ex)
        {
            var source = ex.Kind == AiErrorKind.ResponseError ? "ai_response" : "ai_api";
            return StatusCode(502, new DocumentErrorResponse(source, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(502, new DocumentErrorResponse("ai_api", $"AI service unreachable: {ex.Message}"));
        }
    }

    // ── Request / Error DTOs ──────────────────────────────────────────────────

    public sealed record AnalyzeRequest(string Text);

    private sealed record DocumentErrorResponse(string Source, string Message);
}
