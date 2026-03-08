using Domain.Models.Requests;
using Domain.Models.Responses;

namespace Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}
