using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Api.Controllers;

/// <summary>
/// Proxies currency rate requests to CoinGecko and ExchangeRate-API server-side,
/// avoiding browser CORS restrictions.
/// </summary>
[ApiController]
[Route("api/currency")]
public class CurrencyController : ControllerBase
{
    private static readonly string CoinGeckoUrl =
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=brl";

    private static readonly string ExchangeRateBaseUrl =
        "https://api.exchangerate-api.com/v4/latest";

    private static readonly JsonSerializerOptions JsonOptions =
        new() { PropertyNameCaseInsensitive = true };

    private readonly IHttpClientFactory _httpClientFactory;

    public CurrencyController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    /// <summary>
    /// Returns BRL rates for BTC, ETH, USD, EUR, GBP in a single response.
    /// Falls back to null values for any rate that cannot be fetched.
    /// </summary>
    [HttpGet("rates")]
    public async Task<IActionResult> GetRates()
    {
        var client = _httpClientFactory.CreateClient("CurrencyApi");

        var cryptoTask   = FetchCryptoRates(client);
        var usdTask      = FetchFiatRate(client, "USD");
        var eurTask      = FetchFiatRate(client, "EUR");
        var gbpTask      = FetchFiatRate(client, "GBP");

        await Task.WhenAll(cryptoTask, usdTask, eurTask, gbpTask);

        var crypto = cryptoTask.Result;

        return Ok(new
        {
            bitcoin  = crypto?.Bitcoin?.Brl,
            ethereum = crypto?.Ethereum?.Brl,
            usd      = usdTask.Result,
            eur      = eurTask.Result,
            gbp      = gbpTask.Result,
        });
    }

    private async Task<CoinGeckoRates?> FetchCryptoRates(HttpClient client)
    {
        try
        {
            var response = await client.GetAsync(CoinGeckoUrl);
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<CoinGeckoRates>(json, JsonOptions);
        }
        catch { return null; }
    }

    private async Task<double?> FetchFiatRate(HttpClient client, string currency)
    {
        try
        {
            var response = await client.GetAsync($"{ExchangeRateBaseUrl}/{currency}");
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<ExchangeRateResponse>(json, JsonOptions);
            return data?.Rates?.TryGetValue("BRL", out var rate) == true ? rate : null;
        }
        catch { return null; }
    }

    // ── DTOs ─────────────────────────────────────────────────────────────────

    private sealed class CoinGeckoRates
    {
        [JsonPropertyName("bitcoin")]  public CoinGeckoCoin? Bitcoin  { get; init; }
        [JsonPropertyName("ethereum")] public CoinGeckoCoin? Ethereum { get; init; }
    }

    private sealed class CoinGeckoCoin
    {
        [JsonPropertyName("brl")] public double Brl { get; init; }
    }

    private sealed class ExchangeRateResponse
    {
        [JsonPropertyName("rates")] public Dictionary<string, double>? Rates { get; init; }
    }
}
