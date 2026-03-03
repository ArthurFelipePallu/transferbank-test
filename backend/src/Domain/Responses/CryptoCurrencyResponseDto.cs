using Domain.Enums;

namespace Domain.Responses;

public class CryptoCurrencyResponseDto
{
    public CryptoCurrencyEnum Currency { get; set; }

    public CryptoCurrencyResponseDto(CryptoCurrencyEnum currency)
    {
        Currency = currency;
    }
}