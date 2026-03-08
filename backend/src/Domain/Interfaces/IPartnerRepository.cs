using Domain.Entities;

namespace Domain.Interfaces;

public interface IPartnerRepository
{
    Task<Partner?> GetByIdAsync(Guid id);
    Task<Partner?> GetByCpfAsync(string cpf);
    Task<IEnumerable<Partner>> GetByCompanyIdAsync(Guid companyId);
    Task<Partner> AddAsync(Partner partner);
    Task<Partner> UpdateAsync(Partner partner);
    Task<bool> ExistsByCpfAsync(string cpf);
    Task<decimal> GetTotalShareholdingByCompanyAsync(Guid companyId);
}
