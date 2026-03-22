using Application.Interfaces;
using Application.Options;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Infrastructure.ExternalServices;

/// <summary>
/// OCR.space implementation of IOcrService.
/// Sends the file to the OCR.space API and returns the extracted plain text.
/// </summary>
public sealed class OcrSpaceService : IOcrService
{
    private static readonly string Endpoint = "https://api.ocr.space/parse/image";
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly OcrSpaceOptions    _options;

    public OcrSpaceService(IHttpClientFactory httpClientFactory, IOptions<OcrSpaceOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options           = options.Value;
    }

    public async Task<string> ExtractTextAsync(Stream fileStream, string fileName)
    {
        using var content     = new MultipartFormDataContent();
        var       fileContent = new StreamContent(fileStream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

        content.Add(fileContent,                          "file",             fileName);
        content.Add(new StringContent(_options.Language), "language");
        content.Add(new StringContent(_options.Engine),   "OCREngine");
        content.Add(new StringContent("false"),           "isOverlayRequired");
        content.Add(new StringContent("PDF"),             "filetype");

        var client  = _httpClientFactory.CreateClient("OcrSpaceApi");
        var request = new HttpRequestMessage(HttpMethod.Post, Endpoint) { Content = content };
        request.Headers.Add("apikey", _options.ApiKey);

        var response = await client.SendAsync(request);

        if (!response.IsSuccessStatusCode)
            throw new OcrServiceException($"OCR service returned {(int)response.StatusCode}", OcrErrorKind.ApiError);

        var body = await response.Content.ReadAsStringAsync();
        var data = JsonSerializer.Deserialize<OcrSpaceResponse>(body, JsonOptions);

        if (data?.IsErroredOnProcessing == true)
            throw new OcrServiceException(
                data.ErrorMessage?.FirstOrDefault() ?? "OCR processing error",
                OcrErrorKind.ApiError);

        var text = string.Join("\n", data?.ParsedResults?.Select(r => r.ParsedText) ?? []).Trim();

        if (string.IsNullOrWhiteSpace(text))
            throw new OcrServiceException("Document produced no readable text.", OcrErrorKind.Unreadable);

        return text;
    }

    // ── Response DTOs (private — infrastructure detail) ───────────────────────

    private sealed class OcrSpaceResponse
    {
        [JsonPropertyName("IsErroredOnProcessing")] public bool              IsErroredOnProcessing { get; init; }
        [JsonPropertyName("ErrorMessage")]          public List<string>?     ErrorMessage          { get; init; }
        [JsonPropertyName("ParsedResults")]         public List<ParsedResult>? ParsedResults       { get; init; }
    }

    private sealed class ParsedResult
    {
        [JsonPropertyName("ParsedText")] public string ParsedText { get; init; } = string.Empty;
    }
}

// ── Domain exceptions ─────────────────────────────────────────────────────────

public enum OcrErrorKind { ApiError, Unreadable }

public sealed class OcrServiceException(string message, OcrErrorKind kind) : Exception(message)
{
    public OcrErrorKind Kind { get; } = kind;
}
