using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;

namespace Application.Services;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IPartnerRepository _partnerRepository;
    private readonly IAuthService _authService;

    public CompanyService(
        ICompanyRepository companyRepository, 
        IPartnerRepository partnerRepository,
        IAuthService authService)
    {
        _companyRepository = companyRepository;
        _partnerRepository = partnerRepository;
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
            request.FantasyName,
            request.CryptoCurrencies,
            request.Phone,
            request.Email,
            passwordHash
        );

        var savedCompany = await _companyRepository.AddAsync(company);

        return await MapToResponseAsync(savedCompany);
    }

    public async Task<CompanyResponse?> GetByIdAsync(Guid id)
    {
        var company = await _companyRepository.GetByIdAsync(id);
        return company != null ? await MapToResponseAsync(company) : null;
    }

    public async Task<CompanyResponse?> GetByCnpjAsync(string cnpj)
    {
        var company = await _companyRepository.GetByCnpjAsync(cnpj);
        return company != null ? await MapToResponseAsync(company) : null;
    }

    public async Task<IEnumerable<CompanyResponse>> GetAllAsync()
    {
        var companies = await _companyRepository.GetAllAsync();
        var responses = new List<CompanyResponse>();
        
        foreach (var company in companies)
        {
            responses.Add(await MapToResponseAsync(company));
        }
        
        return responses;
    }


    public async Task<bool> ExistsAsync(string cnpj, string email)
    {
        return await _companyRepository.ExistsAsync(cnpj, email);
    }

    private async Task<CompanyResponse> MapToResponseAsync(Company company)
    {
        var partners = await _partnerRepository.GetByCompanyIdAsync(company.Id);
        var partnerCount = partners.Count();
        
        Console.WriteLine($"Company {company.CompanyName} (ID: {company.Id}) has {partnerCount} partners");
        
        return new CompanyResponse
        {
            Id = company.Id,
            Cnpj = company.Cnpj,
            CompanyName = company.CompanyName,
            FantasyName = company.FantasyName,
            CryptoCurrencies = company.CryptoCurrencies,
            Phone = company.Phone,
            Email = company.Email,
            PartnerCount = partnerCount,
            CreatedAt = company.CreatedAt
        };
    }
}
