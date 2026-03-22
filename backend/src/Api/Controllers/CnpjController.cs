using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Api.Controllers;

/// <summary>
/// Proxies CNPJ lookup requests to BrasilAPI and normalises the response
/// into the shape the frontend expects (matching the publica.cnpj.ws schema).
/// Running server-side avoids all browser CORS restrictions.
/// </summary>
[ApiController]
[Route("api/cnpj")]
public class CnpjController : ControllerBase
{
    private static readonly string BrasilApiBaseUrl = "https://brasilapi.com.br/api/cnpj/v1";
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly IHttpClientFactory _httpClientFactory;

    public CnpjController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("{cnpj}")]
    public async Task<IActionResult> Lookup(string cnpj)
    {
        if (string.IsNullOrWhiteSpace(cnpj) || cnpj.Length != 14 || !cnpj.All(char.IsDigit))
            return BadRequest(new { message = "CNPJ must be exactly 14 digits." });

        var client = _httpClientFactory.CreateClient("CnpjApi");

        try
        {
            var response = await client.GetAsync($"{BrasilApiBaseUrl}/{cnpj}");
            var content  = await response.Content.ReadAsStringAsync();

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return NotFound(new { message = "CNPJ not found." });

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, new { message = content });

            var brasilApi = JsonSerializer.Deserialize<BrasilApiCnpjResponse>(content, JsonOptions);
            if (brasilApi is null)
                return StatusCode(502, new { message = "Invalid response from CNPJ service." });

            return Ok(_mapToFrontendShape(brasilApi));
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new { message = $"CNPJ service unavailable: {ex.Message}" });
        }
        catch (TaskCanceledException)
        {
            return StatusCode(504, new { message = "CNPJ service timed out." });
        }
    }

    // ── Mapping ──────────────────────────────────────────────────────────────

    private static object _mapToFrontendShape(BrasilApiCnpjResponse d) => new
    {
        razao_social = d.RazaoSocial,
        municipio    = new { nome = d.Municipio },
        uf           = d.Uf,
        estabelecimento = new
        {
            cnpj               = d.Cnpj,
            nome_fantasia      = d.NomeFantasia,
            situacao_cadastral = d.DescricaoSituacaoCadastral ?? d.SituacaoCadastral.ToString(),
            tipo_logradouro    = d.DescricaoTipoDeLogradouro,
            logradouro         = d.Logradouro,
            numero             = d.Numero,
            complemento        = d.Complemento,
            bairro             = d.Bairro,
            cep                = d.Cep,
            ddd1               = d.DddTelefone1?[..Math.Min(2, d.DddTelefone1.Length)],
            telefone1          = d.DddTelefone1?[Math.Min(2, d.DddTelefone1.Length)..],
            email              = d.Email,
        },
        socios = d.Qsa?.Select(s => new
        {
            nome              = s.NomeSocio,
            cpf_cnpj_socio    = s.CnpjCpfDoSocio,
            qualificacao_socio = new { descricao = s.QualificacaoSocio },
            percentual_capital_social = (double?)null, // BrasilAPI does not expose shareholding %
        }).ToList(),
    };

    // ── BrasilAPI response DTOs ───────────────────────────────────────────────

    private sealed class BrasilApiCnpjResponse
    {
        [JsonPropertyName("cnpj")]                              public string?  Cnpj                          { get; init; }
        [JsonPropertyName("razao_social")]                      public string?  RazaoSocial                   { get; init; }
        [JsonPropertyName("nome_fantasia")]                     public string?  NomeFantasia                  { get; init; }
        [JsonPropertyName("situacao_cadastral")]                public int      SituacaoCadastral             { get; init; }
        [JsonPropertyName("descricao_situacao_cadastral")]      public string?  DescricaoSituacaoCadastral    { get; init; }
        [JsonPropertyName("descricao_tipo_de_logradouro")]      public string?  DescricaoTipoDeLogradouro     { get; init; }
        [JsonPropertyName("logradouro")]                        public string?  Logradouro                    { get; init; }
        [JsonPropertyName("numero")]                            public string?  Numero                        { get; init; }
        [JsonPropertyName("complemento")]                       public string?  Complemento                   { get; init; }
        [JsonPropertyName("bairro")]                            public string?  Bairro                        { get; init; }
        [JsonPropertyName("cep")]                               public string?  Cep                           { get; init; }
        [JsonPropertyName("ddd_telefone_1")]                    public string?  DddTelefone1                  { get; init; }
        [JsonPropertyName("email")]                             public string?  Email                         { get; init; }
        [JsonPropertyName("municipio")]                         public string?  Municipio                     { get; init; }
        [JsonPropertyName("uf")]                                public string?  Uf                            { get; init; }
        [JsonPropertyName("qsa")]                               public List<BrasilApiSocio>? Qsa              { get; init; }
    }

    private sealed class BrasilApiSocio
    {
        [JsonPropertyName("nome_socio")]        public string? NomeSocio       { get; init; }
        [JsonPropertyName("cnpj_cpf_do_socio")] public string? CnpjCpfDoSocio  { get; init; }
        [JsonPropertyName("qualificacao_socio")] public string? QualificacaoSocio { get; init; }
    }
}
