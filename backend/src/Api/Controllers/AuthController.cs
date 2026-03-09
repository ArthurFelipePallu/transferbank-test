using Application.Interfaces;
using Domain.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;
using Domain.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _localization;

    public AuthController(IAuthService authService, ILocalizationService localization)
    {
        _authService = authService;
        _localization = localization;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
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
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: _localization.GetString("Auth.InvalidCredentials"),
                errorCode: "Unauthorized",
                statusCode: 401
            );
            return Unauthorized(errorResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: _localization.GetString("Error.InternalServer"),
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }
}
