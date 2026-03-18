using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;

namespace Application.Services;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IPartnerRepository _partnerRepository;
    private readonly IPartnerService _partnerService;
    private readonly IAuthService _authService;

    public CompanyService(
        ICompanyRepository companyRepository,
        IPartnerRepository partnerRepository,
        IPartnerService partnerService,
        IAuthService authService)
    {
        _companyRepository = companyRepository;
        _partnerRepository = partnerRepository;
        _partnerService = partnerService;
        _authService = authService;
    }

    public async Task<CompanyResponse> RegisterAsync(RegisterCompanyRequest request)
    {
        if (await _companyRepository.ExistsAsync(request.Cnpj, request.Email))
            throw new InvalidOperationException("Company with this CNPJ or Email already exists");

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

        // Delegate partner creation to IPartnerService (SRP — CompanyService owns company, not partners)
        foreach (var dto in request.Partners)
            await _partnerService.RegisterFromOnboardingAsync(savedCompany.Id, dto);

        return await BuildResponseAsync(savedCompany);
    }

    public async Task<CompanyResponse?> GetByIdAsync(Guid id)
    {
        var company = await _companyRepository.GetByIdAsync(id);
        return company != null ? await BuildResponseAsync(company) : null;
    }

    public async Task<CompanyResponse?> GetByCnpjAsync(string cnpj)
    {
        var company = await _companyRepository.GetByCnpjAsync(cnpj);
        return company != null ? await BuildResponseAsync(company) : null;
    }

    public async Task<IEnumerable<CompanyResponse>> GetAllAsync()
    {
        var companies = await _companyRepository.GetAllAsync();
        var responses = new List<CompanyResponse>();
        foreach (var company in companies)
            responses.Add(await BuildResponseAsync(company));
        return responses;
    }

    public async Task<bool> ExistsAsync(string cnpj, string email)
        => await _companyRepository.ExistsAsync(cnpj, email);

    // ─── Private helpers ──────────────────────────────────────────────────────

    private async Task<CompanyResponse> BuildResponseAsync(Company company)
    {
        var partners = (await _partnerRepository.GetByCompanyIdAsync(company.Id)).ToList();
        return CompanyMapper.ToResponse(company, partners);
    }
}
