using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Domain.Models;

public record CryptoCurrencyDto(
    [property: Required] CryptoCurrencyEnum Value,
    [property: Required] string Alias
);

