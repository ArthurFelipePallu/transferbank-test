using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Responses;

public record CryptoCurrencyDto(
    [property: Required] CryptoCurrencyEnum Value,
    [property: Required] string Alias
);

