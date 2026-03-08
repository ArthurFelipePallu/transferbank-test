using Application.Interfaces;
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

    public PartnerController(IPartnerService partnerService)
    {
        _partnerService = partnerService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<PartnerResponse>> Register([FromBody] RegisterPartnerRequest request)
    {
        try
        {
            var response = await _partnerService.RegisterAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: ex.Message,
                errorCode: "InvalidOperation",
                statusCode: 400
            );
            return BadRequest(errorResponse);
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
                message: "An error occurred during partner registration",
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
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
                    message: "Partner not found",
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
                message: "An error occurred while retrieving partner",
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
                message: "An error occurred while retrieving partners",
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
                message: "An error occurred while calculating shareholding",
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }
}
