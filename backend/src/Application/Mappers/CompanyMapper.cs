using Domain.Entities;
using Domain.Models.Responses;

namespace Application.Mappers;

/// <summary>
/// Pure static mapper — Company entity + resolved partners → CompanyResponse DTO.
/// Delegates partner mapping to PartnerMapper (SRP).
/// </summary>
public static class CompanyMapper
{
    public static CompanyResponse ToResponse(Company company, IReadOnlyList<Partner> partners)
    {
        var partnerResponses = partners.Select(PartnerMapper.ToResponse).ToList();

        return new CompanyResponse
        {
            Id = company.Id,
            Cnpj = company.Cnpj,
            CompanyName = company.CompanyName,
            FantasyName = company.FantasyName,
            CryptoCurrencies = company.CryptoCurrencies,
            Phone = company.Phone,
            Email = company.Email,
            PartnerCount = partnerResponses.Count,
            Partners = partnerResponses,
            CreatedAt = company.CreatedAt,
        };
    }
}
