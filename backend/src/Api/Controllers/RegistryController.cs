using Domain.Models;
using Domain.Responses;
using Domain.Utils;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegistryController : ControllerBase
{
    private readonly BadRegistryData _badRegistryData = new();
    
    [HttpPost("register")]
    public ActionResult RegisterCompany([FromBody] CompanyDto companyDto)
    {
        try
        {
            if (companyDto.Cnpj != _badRegistryData.badCompany.Cnpj) return Ok();
            
            var errorResponse = new ErrorResponseDto(
                message: "CNPJ invalid",
                errorCode: "InvalidData",
                statusCode: 400);
            return BadRequest(errorResponse);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    
    
    
}