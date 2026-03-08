using Application.Interfaces;
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

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: ex.Message,
                errorCode: "Unauthorized",
                statusCode: 401
            );
            return Unauthorized(errorResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = new ErrorResponseDto(
                message: "An error occurred during login",
                errorCode: "InternalError",
                statusCode: 500
            );
            return StatusCode(500, errorResponse);
        }
    }
}
