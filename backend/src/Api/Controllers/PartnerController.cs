using Application.Interfaces;
using Domain.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;
using Domain.Responses;
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
        // Check model state for validation errors
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            
            var errorResponse = new ErrorResponseDto(
                message: string.Join("; ", errors),
                errorCode: "ValidationError",
                statusCode: 400
            );
            return BadRequest(errorResponse);
        }

        try
        {
            var response = await _partnerService.RegisterAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: _localizationService.GetString("Partner.ShareholdingExceeded"),
                errorCode: "InvalidOperation",
                statusCode: 400
            );
            return BadRequest(errorResponse);
        }
        catch (ArgumentException ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: _localizationService.GetString("Error.BadRequest"),
                errorCode: "InvalidData",
                statusCode: 400
            );
            return BadRequest(errorResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: _localizationService.GetString("Error.InternalServer"),
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PartnerResponse>> Update(Guid id, [FromBody] UpdatePartnerRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            return BadRequest(new ErrorResponseDto(
                message: string.Join("; ", errors),
                errorCode: "ValidationError",
                statusCode: 400));
        }

        try
        {
            var response = await _partnerService.UpdateAsync(id, request);
            return Ok(response);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ErrorResponseDto(
                message: _localizationService.GetString("Partner.NotFound"),
                errorCode: "NotFound",
                statusCode: 404));
        }
        catch (InvalidOperationException)
        {
            return BadRequest(new ErrorResponseDto(
                message: _localizationService.GetString("Partner.ShareholdingExceeded"),
                errorCode: "InvalidOperation",
                statusCode: 400));
        }
        catch (Exception)
        {
            return StatusCode(500, new ErrorResponseDto(
                message: _localizationService.GetString("Error.InternalServer"),
                errorCode: "InternalError",
                statusCode: 500));
        }
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<PartnerResponse>> Patch(Guid id, [FromBody] PatchPartnerRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            return BadRequest(new ErrorResponseDto(
                message: string.Join("; ", errors),
                errorCode: "ValidationError",
                statusCode: 400));
        }

        try
        {
            var response = await _partnerService.PatchAsync(id, request);
            return Ok(response);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ErrorResponseDto(
                message: _localizationService.GetString("Partner.NotFound"),
                errorCode: "NotFound",
                statusCode: 404));
        }
        catch (InvalidOperationException)
        {
            return BadRequest(new ErrorResponseDto(
                message: _localizationService.GetString("Partner.ShareholdingExceeded"),
                errorCode: "InvalidOperation",
                statusCode: 400));
        }
        catch (Exception)
        {
            return StatusCode(500, new ErrorResponseDto(
                message: _localizationService.GetString("Error.InternalServer"),
                errorCode: "InternalError",
                statusCode: 500));
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PartnerResponse>> GetById(Guid id)
    {
        try
        {
            var partner = await _partnerService.GetByIdAsync(id);
            if (partner == null)
            {
                var errorResponse = new ErrorResponseDto(
                    message: _localizationService.GetString("Partner.NotFound"),
                    errorCode: "NotFound",
                    statusCode: 404
                );
                return NotFound(errorResponse);
            }

            return Ok(partner);
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: _localizationService.GetString("Error.InternalServer"),
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("company/{companyId:guid}")]
    public async Task<ActionResult<IEnumerable<PartnerResponse>>> GetByCompanyId(Guid companyId)
    {
        try
        {
            var partners = await _partnerService.GetByCompanyIdAsync(companyId);
            return Ok(partners);
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: _localizationService.GetString("Error.InternalServer"),
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("company/{companyId:guid}/shareholding")]
    public async Task<ActionResult<decimal>> GetTotalShareholding(Guid companyId)
    {
        try
        {
            var total = await _partnerService.GetTotalShareholdingByCompanyAsync(companyId);
            return Ok(new { companyId, totalShareholding = total, remaining = 100 - total });
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: _localizationService.GetString("Error.InternalServer"),
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }
}
