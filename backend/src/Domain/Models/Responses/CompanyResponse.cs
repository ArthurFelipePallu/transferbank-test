using Domain.Enums;

namespace Domain.Models.Responses;

public class CompanyResponse
{
    public Guid Id { get; set; }
    public string Cnpj { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string FantasyName { get; set; } = string.Empty;
    public CryptoCurrencyEnum[] CryptoCurrencies { get; set; } = Array.Empty<CryptoCurrencyEnum>();
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int PartnerCount { get; set; }
    public List<PartnerResponse> Partners { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}
