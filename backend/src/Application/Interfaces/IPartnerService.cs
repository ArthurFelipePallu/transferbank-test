using Domain.Models.Requests;
using Domain.Models.Responses;

namespace Application.Interfaces;

public interface IPartnerService
{
    Task<PartnerResponse> RegisterAsync(RegisterPartnerRequest request);

    /// <summary>
    /// Registers a partner from onboarding DTO data, binding it to the given company.
    /// Separates the onboarding flow (no CompanyId in DTO) from the standalone partner endpoint.
    /// </summary>
    Task<PartnerResponse> RegisterFromOnboardingAsync(Guid companyId, PartnerRegistrationDto dto);

    Task<PartnerResponse> UpdateAsync(Guid id, UpdatePartnerRequest request);
    Task<PartnerResponse> PatchAsync(Guid id, PatchPartnerRequest request);

    Task<PartnerResponse?> GetByIdAsync(Guid id);
    Task<IEnumerable<PartnerResponse>> GetByCompanyIdAsync(Guid companyId);
    Task<decimal> GetTotalShareholdingByCompanyAsync(Guid companyId);
}
