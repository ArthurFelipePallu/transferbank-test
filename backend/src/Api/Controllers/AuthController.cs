using Application.Interfaces;
using Domain.Constants;
using Domain.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;
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
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage);
            return BadRequest(new ErrorResponseDto(
                string.Join("; ", errors), "ValidationError", 400));
        }

        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new ErrorResponseDto(
                _localization.GetString(LocalizationKeys.Auth.InvalidCredentials),
                "Unauthorized", 401));
        }
    }
}
