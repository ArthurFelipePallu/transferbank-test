using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Models.Requests;
using Domain.Models.Responses;

namespace Application.Services;

public class PartnerService : IPartnerService
{
    private readonly IPartnerRepository _partnerRepository;
    private readonly ICompanyRepository _companyRepository;

    public PartnerService(IPartnerRepository partnerRepository, ICompanyRepository companyRepository)
    {
        _partnerRepository = partnerRepository;
        _companyRepository = companyRepository;
    }

    public async Task<PartnerResponse> RegisterAsync(RegisterPartnerRequest request)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId)
            ?? throw new InvalidOperationException("Company not found");

        await ValidateShareholdingCapAsync(request.CompanyId, request.Shareholding);

        var partner = BuildPartner(request.CompanyId, request.FullName, request.Cpf,
            request.Nationality, request.Shareholding, request.IsPep, request.Documents);

        var saved = await _partnerRepository.AddAsync(partner);
        return PartnerMapper.ToResponse(saved);
    }

    public async Task<PartnerResponse> RegisterFromOnboardingAsync(Guid companyId, PartnerRegistrationDto dto)
    {
        await ValidateShareholdingCapAsync(companyId, dto.Shareholding);

        var partner = BuildPartner(companyId, dto.FullName, dto.Cpf,
            dto.Nationality, dto.Shareholding, dto.IsPep, dto.Documents);

        var saved = await _partnerRepository.AddAsync(partner);
        return PartnerMapper.ToResponse(saved);
    }

    public async Task<PartnerResponse?> GetByIdAsync(Guid id)
    {
        var partner = await _partnerRepository.GetByIdAsync(id);
        return partner != null ? PartnerMapper.ToResponse(partner) : null;
    }

    public async Task<IEnumerable<PartnerResponse>> GetByCompanyIdAsync(Guid companyId)
    {
        var partners = await _partnerRepository.GetByCompanyIdAsync(companyId);
        return partners.Select(PartnerMapper.ToResponse);
    }

    public async Task<decimal> GetTotalShareholdingByCompanyAsync(Guid companyId)
    {
        var partners = await _partnerRepository.GetByCompanyIdAsync(companyId);
        return partners.Sum(p => p.Shareholding);
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private async Task ValidateShareholdingCapAsync(Guid companyId, decimal incoming)
    {
        var current = await GetTotalShareholdingByCompanyAsync(companyId);
        if (current + incoming > 100)
            throw new InvalidOperationException(
                $"Total shareholding would exceed 100%. Current: {current}%, Attempting to add: {incoming}%");
    }

    private static Partner BuildPartner(
        Guid companyId, string fullName, string cpf,
        string nationality, decimal shareholding, bool isPep,
        IEnumerable<DocumentRequest> documents)
    {
        var partner = new Partner(companyId, fullName, cpf, nationality, shareholding, isPep);
        foreach (var doc in documents)
            partner.AddDocument(new Document(doc.Name, doc.Size, doc.Type));
        return partner;
    }
}
