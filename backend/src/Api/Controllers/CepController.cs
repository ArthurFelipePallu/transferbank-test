using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Api.Controllers;

/// <summary>
/// Proxies CEP lookups to ViaCEP server-side, avoiding browser CORS restrictions.
/// </summary>
[ApiController]
[Route("api/cep")]
public class CepController : ControllerBase
{
    private static readonly string ViaCepBaseUrl = "https://viacep.com.br/ws";
    private static readonly JsonSerializerOptions JsonOptions =
        new() { PropertyNameCaseInsensitive = true };

    private readonly IHttpClientFactory _httpClientFactory;

    public CepController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("{cep}")]
    public async Task<IActionResult> Lookup(string cep)
    {
        if (string.IsNullOrWhiteSpace(cep) || cep.Length != 8 || !cep.All(char.IsDigit))
            return BadRequest(new { message = "CEP must be exactly 8 digits." });

        var client = _httpClientFactory.CreateClient("CepApi");

        try
        {
            var response = await client.GetAsync($"{ViaCepBaseUrl}/{cep}/json/");
            var content  = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, new { message = content });

            var data = JsonSerializer.Deserialize<ViaCepResponse>(content, JsonOptions);

            if (data is null || data.Erro == true)
                return NotFound(new { message = "CEP not found." });

            return Ok(data);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new { message = $"CEP service unavailable: {ex.Message}" });
        }
        catch (TaskCanceledException)
        {
            return StatusCode(504, new { message = "CEP service timed out." });
        }
    }

    private sealed class ViaCepResponse
    {
        [JsonPropertyName("erro")]        public bool?   Erro        { get; init; }
        [JsonPropertyName("cep")]         public string? Cep         { get; init; }
        [JsonPropertyName("logradouro")]  public string? Logradouro  { get; init; }
        [JsonPropertyName("complemento")] public string? Complemento { get; init; }
        [JsonPropertyName("bairro")]      public string? Bairro      { get; init; }
        [JsonPropertyName("localidade")]  public string? Localidade  { get; init; }
        [JsonPropertyName("uf")]          public string? Uf          { get; init; }
    }
}
