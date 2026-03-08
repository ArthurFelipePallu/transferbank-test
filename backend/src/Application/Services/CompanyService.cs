using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;

namespace Application.Services;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IAuthService _authService;

    public CompanyService(ICompanyRepository companyRepository, IAuthService authService)
    {
        _companyRepository = companyRepository;
        _authService = authService;
    }

    public async Task<CompanyResponse> RegisterAsync(RegisterCompanyRequest request)
    {
        if (await _companyRepository.ExistsAsync(request.Cnpj, request.Email))
        {
            throw new InvalidOperationException("Company with this CNPJ or Email already exists");
        }

        var passwordHash = _authService.HashPassword(request.Password);

        var company = new Company(
            request.Cnpj,
            request.CompanyName,
            request.FullName,
            request.CryptoCurrencies,
            request.Phone,
            request.Email,
            passwordHash
        );

        var savedCompany = await _companyRepository.AddAsync(company);

        return MapToResponse(savedCompany);
    }

    public async Task<CompanyResponse?> GetByIdAsync(Guid id)
    {
        var company = await _companyRepository.GetByIdAsync(id);
        return company != null ? MapToResponse(company) : null;
    }

    public async Task<CompanyResponse?> GetByCnpjAsync(string cnpj)
    {
        var company = await _companyRepository.GetByCnpjAsync(cnpj);
        return company != null ? MapToResponse(company) : null;
    }

    public async Task<IEnumerable<CompanyResponse>> GetAllAsync()
    {
        var companies = await _companyRepository.GetAllAsync();
        return companies.Select(MapToResponse);
    }


    public async Task<bool> ExistsAsync(string cnpj, string email)
    {
        return await _companyRepository.ExistsAsync(cnpj, email);
    }

    private static CompanyResponse MapToResponse(Company company)
    {
        return new CompanyResponse
        {
            Id = company.Id,
            Cnpj = company.Cnpj,
            CompanyName = company.CompanyName,
            FullName = company.FullName,
            CryptoCurrencies = company.CryptoCurrencies,
            Phone = company.Phone,
            Email = company.Email,
            CreatedAt = company.CreatedAt
        };
    }
}
