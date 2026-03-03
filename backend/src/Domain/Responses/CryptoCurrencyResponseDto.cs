using Domain.Enums;
using Domain.Models;

namespace Domain.Responses;

public class CryptoCurrencyResponseDto
{
    public CryptoCurrencyDto Currency { get; set; }

    public CryptoCurrencyResponseDto(CryptoCurrencyDto currency)
    {
        Currency = currency;
    }
}