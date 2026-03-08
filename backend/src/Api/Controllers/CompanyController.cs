using Application.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;
using Domain.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompanyController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompanyController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompanyResponse>>> GetAll()
    {
        try
        {
            var companies = await _companyService.GetAllAsync();
            return Ok(companies);
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: "An error occurred while retrieving companies",
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult<CompanyResponse>> Register([FromBody] RegisterCompanyRequest request)
    {
        try
        {
            var response = await _companyService.RegisterAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: ex.Message,
                errorCode: "CompanyAlreadyExists",
                statusCode: 409
            );
            return Conflict(errorResponse);
        }
        catch (ArgumentException ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: ex.Message,
                errorCode: "InvalidData",
                statusCode: 400
            );
            return BadRequest(errorResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: "An error occurred during registration",
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CompanyResponse>> GetById(Guid id)
    {
        try
        {
            var company = await _companyService.GetByIdAsync(id);
            if (company == null)
            {
                var errorResponse = new ErrorResponseDto(
                    message: "Company not found",
                    errorCode: "NotFound",
                    statusCode: 404
                );
                return NotFound(errorResponse);
            }

            return Ok(company);
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: "An error occurred while retrieving company",
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("cnpj/{cnpj}")]
    public async Task<ActionResult<CompanyResponse>> GetByCnpj(string cnpj)
    {
        try
        {
            var company = await _companyService.GetByCnpjAsync(cnpj);
            if (company == null)
            {
                var errorResponse = new ErrorResponseDto(
                    message: "Company not found",
                    errorCode: "NotFound",
                    statusCode: 404
                );
                return NotFound(errorResponse);
            }

            return Ok(company);
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: "An error occurred while retrieving company",
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("exists")]
    public async Task<ActionResult<bool>> Exists([FromQuery] string cnpj, [FromQuery] string email)
    {
        try
        {
            var exists = await _companyService.ExistsAsync(cnpj, email);
            return Ok(new { exists });
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: "An error occurred while checking company existence",
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }
}
