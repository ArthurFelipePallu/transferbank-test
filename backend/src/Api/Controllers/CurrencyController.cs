using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;
using Domain.Enums;
using Domain.Extensions;

namespace Api.Controllers;

/// <summary>
/// Handles crypto currency metadata and proxies live rate requests
/// to CoinGecko / ExchangeRate-API server-side (no browser CORS issues).
/// </summary>
[ApiController]
[Route("api/currency")]
public class CurrencyController : ControllerBase
{
    // ── Crypto metadata endpoints (used by onboarding form) ──────────────────

    /// <summary>Returns all supported crypto currencies as value/alias pairs.</summary>
    [HttpGet("all-crypto-currencies")]
    public IActionResult GetAllCryptoCurrencies()
    {
        var result = Enum.GetValues<CryptoCurrencyEnum>()
            .Select(c => new { value = c.ToString(), alias = c.GetDisplayName() });
        return Ok(result);
    }

    /// <summary>Returns the crypto currency with the highest enum value (used as default).</summary>
    [HttpGet("most-valuable-currency")]
    public IActionResult GetMostValuableCurrency()
    {
        var top = Enum.GetValues<CryptoCurrencyEnum>()
            .OrderByDescending(c => (int)c)
            .First();
        return Ok(new { value = top.ToString(), alias = top.GetDisplayName() });
    }

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
