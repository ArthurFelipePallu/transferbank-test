using Application.Interfaces;
using Domain.Constants;
using Domain.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompanyController : ControllerBase
{
    private readonly ICompanyService _companyService;
    private readonly ILocalizationService _localizationService;

    public CompanyController(ICompanyService companyService, ILocalizationService localizationService)
    {
        _companyService = companyService;
        _localizationService = localizationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompanyResponse>>> GetAll()
    {
        var companies = await _companyService.GetAllAsync();
        return Ok(companies);
    }

    [HttpPost("register")]
    public async Task<ActionResult<CompanyResponse>> Register([FromBody] RegisterCompanyRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ValidationError());

        try
        {
            var response = await _companyService.RegisterAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException)
        {
            return Conflict(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Company.AlreadyExists),
                "CompanyAlreadyExists", 409));
        }
        catch (ArgumentException)
        {
            return BadRequest(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Error.BadRequest),
                "InvalidData", 400));
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CompanyResponse>> GetById(Guid id)
    {
        var company = await _companyService.GetByIdAsync(id);
        if (company == null)
            return NotFound(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Company.NotFound),
                "NotFound", 404));

        return Ok(company);
    }

    [HttpGet("cnpj/{cnpj}")]
    public async Task<ActionResult<CompanyResponse>> GetByCnpj(string cnpj)
    {
        var company = await _companyService.GetByCnpjAsync(cnpj);
        if (company == null)
            return NotFound(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Company.NotFound),
                "NotFound", 404));

        return Ok(company);
    }

    [HttpGet("exists")]
    public async Task<ActionResult<bool>> Exists([FromQuery] string cnpj, [FromQuery] string email)
    {
        var exists = await _companyService.ExistsAsync(cnpj, email);
        return Ok(exists);
    }

    [HttpGet("exists-by-email")]
    public async Task<ActionResult<bool>> ExistsByEmail([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Error.BadRequest),
                "InvalidData", 400));

        var exists = await _companyService.ExistsByEmailAsync(email);
        return Ok(exists);
    }

    private ErrorResponseDto ValidationError() =>
        new(string.Join("; ", ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)),
            "ValidationError", 400);
}
