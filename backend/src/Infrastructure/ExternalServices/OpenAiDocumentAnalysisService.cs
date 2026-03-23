using Application.Interfaces;
using Application.Options;
using Domain.Models.Responses;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Infrastructure.ExternalServices;

/// <summary>
/// OpenAI implementation of IDocumentAnalysisService.
/// Sends extracted text to the ChatCompletions API and parses the structured result.
/// </summary>
public sealed class OpenAiDocumentAnalysisService : IDocumentAnalysisService
{
    private static readonly string   Endpoint             = "https://api.openai.com/v1/chat/completions";
    private static readonly int      TextTruncationLimit  = 12_000;
    private static readonly double   ConfidenceThreshold  = 0.70;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private static readonly string SystemPromptTemplate = @"You are a document validation assistant for a Brazilian financial institution.
Analyze the provided text and determine whether it is a valid Brazilian social contract (Contrato Social).

IMPORTANT: Respond with all text fields (""reason"" and all ""notes"") in {LANGUAGE}.

Evaluate EACH of the following criteria and assign a score from 0.0 to 1.0:

1. companyIdentification (weight 0.20): Company name, CNPJ or registration number, and company purpose (objeto social) are present and coherent.
2. partnerData (weight 0.25): All partners (sócios) are listed with full name, CPF or RG, nationality, and shareholding percentage. Partial or missing partner data lowers this score.
3. signatures (weight 0.25): The document contains evidence of signatures — handwritten, digital certificate (ICP-Brasil), or gov.br digital signature. Absence of any signature indication scores 0.
4. requiredClauses (weight 0.15): Mandatory clauses are present: share capital (capital social), company duration (prazo), liability type, and administration rules.
5. documentIntegrity (weight 0.15): The document is coherent, uses appropriate legal language, has no gross errors, and genuinely resembles a Brazilian social contract. Obvious fakes, random text, or unrelated documents score 0.

Apply fuzzy logic: partial presence of a criterion should yield a proportional score, not binary 0 or 1.

Compute the confidenceIndex as the weighted average:
  confidenceIndex = (companyIdentification.score * 0.20) + (partnerData.score * 0.25) + (signatures.score * 0.25) + (requiredClauses.score * 0.15) + (documentIntegrity.score * 0.15)

Set isValid to true ONLY if confidenceIndex >= 0.70.

Respond ONLY with a JSON object in this exact format, no markdown, no extra text:
{
  ""isValid"": true,
  ""confidenceIndex"": 0.85,
  ""reason"": ""Brief overall assessment"",
  ""criteria"": {
    ""companyIdentification"": { ""score"": 1.0, ""weight"": 0.20, ""notes"": ""..."" },
    ""partnerData"":           { ""score"": 0.9, ""weight"": 0.25, ""notes"": ""..."" },
    ""signatures"":            { ""score"": 0.8, ""weight"": 0.25, ""notes"": ""..."" },
    ""requiredClauses"":       { ""score"": 0.7, ""weight"": 0.15, ""notes"": ""..."" },
    ""documentIntegrity"":     { ""score"": 1.0, ""weight"": 0.15, ""notes"": ""..."" }
  }
}";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly OpenAiOptions      _options;

    public OpenAiDocumentAnalysisService(IHttpClientFactory httpClientFactory, IOptions<OpenAiOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options           = options.Value;
    }

    public async Task<DocumentAnalysisResponse> AnalyzeAsync(string extractedText, string? locale = null)
    {
        var language = locale?.StartsWith("pt", StringComparison.OrdinalIgnoreCase) == true
            ? "Brazilian Portuguese (pt-BR)"
            : "English";

        var systemPrompt = SystemPromptTemplate.Replace("{LANGUAGE}", language);
        var truncated = extractedText.Length > TextTruncationLimit
            ? extractedText[..TextTruncationLimit]
            : extractedText;

        var payload = new
        {
            model       = _options.Model,
            max_tokens  = _options.MaxTokens,
            temperature = 0,
            messages    = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user",   content = truncated    },
            },
        };

        var client = _httpClientFactory.CreateClient("OpenAiApi");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);

        var requestBody = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await client.PostAsync(Endpoint, requestBody);

        if (!response.IsSuccessStatusCode)
        {
            var errBody = await response.Content.ReadAsStringAsync();
            throw new AiServiceException($"AI service returned {(int)response.StatusCode}: {errBody}", AiErrorKind.ApiError);
        }

        var body    = await response.Content.ReadAsStringAsync();
        var aiData  = JsonSerializer.Deserialize<OpenAiResponse>(body, JsonOptions);
        var content = aiData?.Choices?.FirstOrDefault()?.Message?.Content ?? string.Empty;

        DocumentAnalysisResponse result;
        try
        {
            result = JsonSerializer.Deserialize<DocumentAnalysisResponse>(content, JsonOptions)
                     ?? throw new InvalidOperationException("Null deserialization result");
        }
        catch
        {
            throw new AiServiceException("AI returned an unexpected response format.", AiErrorKind.ResponseError);
        }

        // Enforce threshold server-side regardless of what the model returned
        result.IsValid = result.ConfidenceIndex >= ConfidenceThreshold;
        return result;
    }

    // ── Response DTOs (private — infrastructure detail) ───────────────────────

    private sealed class OpenAiResponse
    {
        [JsonPropertyName("choices")] public List<OpenAiChoice>? Choices { get; init; }
    }

    private sealed class OpenAiChoice
    {
        [JsonPropertyName("message")] public OpenAiMessage? Message { get; init; }
    }

    private sealed class OpenAiMessage
    {
        [JsonPropertyName("content")] public string? Content { get; init; }
    }
}

// ── Domain exceptions ─────────────────────────────────────────────────────────

public enum AiErrorKind { ApiError, ResponseError }

public sealed class AiServiceException(string message, AiErrorKind kind) : Exception(message)
{
    public AiErrorKind Kind { get; } = kind;
}
