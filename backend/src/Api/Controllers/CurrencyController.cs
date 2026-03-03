using Domain.Enums;
using Domain.Models;
using Domain.Responses;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CurrencyController : ControllerBase
{
    [HttpGet("most-valuable-currency")]
    public ActionResult<CryptoCurrencyResponseDto> GetMostValuableCurrency()
    {
        var currencyResponse = new CryptoCurrencyResponseDto(CryptoCurrencyEnum.Bitcoin);
        return Ok(currencyResponse);
    }
}