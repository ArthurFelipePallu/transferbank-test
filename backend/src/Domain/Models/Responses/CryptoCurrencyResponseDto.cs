namespace Domain.Models.Responses;

public class CryptoCurrencyResponseDto
{
    public CryptoCurrencyDto Currency { get; set; }

    public CryptoCurrencyResponseDto(CryptoCurrencyDto currency)
    {
        Currency = currency;
    }
}