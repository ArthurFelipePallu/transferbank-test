using Domain.Models.Requests;
using Domain.Models.Responses;

namespace Application.Interfaces;

public interface IPartnerService
{
    Task<PartnerResponse> RegisterAsync(RegisterPartnerRequest request);
    Task<PartnerResponse?> GetByIdAsync(Guid id);
    Task<IEnumerable<PartnerResponse>> GetByCompanyIdAsync(Guid companyId);
    Task<decimal> GetTotalShareholdingByCompanyAsync(Guid companyId);
}
