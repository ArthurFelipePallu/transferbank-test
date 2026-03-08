using Application.Interfaces;
using Domain.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;

namespace Application.Services;

public class AuthService : IAuthService
{
    private readonly ICompanyRepository _companyRepository;

    public AuthService(ICompanyRepository companyRepository)
    {
        _companyRepository = companyRepository;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var company = await _companyRepository.GetByEmailAsync(request.Email);
        
        if (company == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        if (!VerifyPassword(request.Password, company.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        return new LoginResponse
        {
            CompanyId = company.Id,
            Email = company.Email,
            CompanyName = company.CompanyName,
            Token = GenerateToken(company.Id)
        };
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }

    private string GenerateToken(Guid companyId)
    {
        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{companyId}:{DateTime.UtcNow.Ticks}"));
    }
}
