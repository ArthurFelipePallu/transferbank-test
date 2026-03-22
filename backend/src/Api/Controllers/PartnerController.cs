using Application.Interfaces;
using Domain.Constants;
using Domain.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PartnerController : ControllerBase
{
    private readonly IPartnerService _partnerService;
    private readonly ILocalizationService _localizationService;

    public PartnerController(IPartnerService partnerService, ILocalizationService localizationService)
    {
        _partnerService = partnerService;
        _localizationService = localizationService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<PartnerResponse>> Register([FromBody] RegisterPartnerRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ValidationError());

        try
        {
            var response = await _partnerService.RegisterAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException)
        {
            return BadRequest(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Partner.ShareholdingExceeded),
                "InvalidOperation", 400));
        }
        catch (ArgumentException)
        {
            return BadRequest(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Error.BadRequest),
                "InvalidData", 400));
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PartnerResponse>> Update(Guid id, [FromBody] UpdatePartnerRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ValidationError());

        try
        {
            var response = await _partnerService.UpdateAsync(id, request);
            return Ok(response);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Partner.NotFound),
                "NotFound", 404));
        }
        catch (InvalidOperationException)
        {
            return BadRequest(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Partner.ShareholdingExceeded),
                "InvalidOperation", 400));
        }
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<PartnerResponse>> Patch(Guid id, [FromBody] PatchPartnerRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ValidationError());

        try
        {
            var response = await _partnerService.PatchAsync(id, request);
            return Ok(response);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Partner.NotFound),
                "NotFound", 404));
        }
        catch (InvalidOperationException)
        {
            return BadRequest(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Partner.ShareholdingExceeded),
                "InvalidOperation", 400));
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PartnerResponse>> GetById(Guid id)
    {
        var partner = await _partnerService.GetByIdAsync(id);
        if (partner == null)
            return NotFound(new ErrorResponseDto(
                _localizationService.GetString(LocalizationKeys.Partner.NotFound),
                "NotFound", 404));

        return Ok(partner);
    }

    [HttpGet("company/{companyId:guid}")]
    public async Task<ActionResult<IEnumerable<PartnerResponse>>> GetByCompanyId(Guid companyId)
    {
        var partners = await _partnerService.GetByCompanyIdAsync(companyId);
        return Ok(partners);
    }

    [HttpGet("company/{companyId:guid}/shareholding")]
    public async Task<ActionResult<decimal>> GetTotalShareholding(Guid companyId)
    {
        var total = await _partnerService.GetTotalShareholdingByCompanyAsync(companyId);
        return Ok(new { companyId, totalShareholding = total, remaining = 100 - total });
    }

    private ErrorResponseDto ValidationError() =>
        new(string.Join("; ", ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)),
            "ValidationError", 400);
}
