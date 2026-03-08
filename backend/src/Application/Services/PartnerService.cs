using Application.Interfaces;
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
        var company = await _companyRepository.GetByIdAsync(request.CompanyId);
        if (company == null)
        {
            throw new InvalidOperationException("Company not found");
        }

        var currentTotal = await GetTotalShareholdingByCompanyAsync(request.CompanyId);
        if (currentTotal + request.Shareholding > 100)
        {
            throw new InvalidOperationException($"Total shareholding would exceed 100%. Current: {currentTotal}%, Attempting to add: {request.Shareholding}%");
        }

        var partner = new Partner(
            request.CompanyId,
            request.FullName,
            request.Cpf,
            request.Nationality,
            request.Shareholding,
            request.IsPep
        );

        foreach (var doc in request.Documents)
        {
            var document = new Document(doc.Name, doc.Size, doc.Type);
            partner.AddDocument(document);
        }

        var savedPartner = await _partnerRepository.AddAsync(partner);

        return MapToResponse(savedPartner);
    }

    public async Task<PartnerResponse?> GetByIdAsync(Guid id)
    {
        var partner = await _partnerRepository.GetByIdAsync(id);
        return partner != null ? MapToResponse(partner) : null;
    }

    public async Task<IEnumerable<PartnerResponse>> GetByCompanyIdAsync(Guid companyId)
    {
        var partners = await _partnerRepository.GetByCompanyIdAsync(companyId);
        return partners.Select(MapToResponse);
    }

    public async Task<decimal> GetTotalShareholdingByCompanyAsync(Guid companyId)
    {
        var partners = await _partnerRepository.GetByCompanyIdAsync(companyId);
        return partners.Sum(p => p.Shareholding);
    }

    private static PartnerResponse MapToResponse(Partner partner)
    {
        return new PartnerResponse
        {
            Id = partner.Id,
            CompanyId = partner.CompanyId,
            FullName = partner.FullName,
            Cpf = partner.Cpf,
            Nationality = partner.Nationality,
            Shareholding = partner.Shareholding,
            IsPep = partner.IsPep,
            Documents = partner.Documents.Select(d => new DocumentResponse
            {
                Id = d.Id,
                Name = d.Name,
                Size = d.Size,
                Type = d.Type,
                UploadedAt = d.UploadedAt
            }).ToList(),
            CreatedAt = partner.CreatedAt
        };
    }
}
