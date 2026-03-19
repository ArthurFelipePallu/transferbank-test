using Domain.Enums;
using Domain.Extensions;
using Domain.Models.Responses;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CurrencyController : ControllerBase
{
    [HttpGet("most-valuable-currency")]
    public ActionResult<CryptoCurrencyDto> GetMostValuableCurrency()
    {
        var mostValuable = CryptoCurrencyEnum.Bitcoin;

        var dto = new CryptoCurrencyDto(
            mostValuable,
            mostValuable.GetDisplayName()
        );

        var response = new CryptoCurrencyResponseDto(dto);

        return Ok(response);
    }

    [HttpGet("all-crypto-currencies")]
    public ActionResult<IEnumerable<CryptoCurrencyDto>> GetCryptoCurrencies()
    {
        var values = Enum.GetValues<CryptoCurrencyEnum>()
            .Select(e => new CryptoCurrencyDto(
                e,
                e.GetDisplayName()
            ));

        return Ok(values);
    }
}