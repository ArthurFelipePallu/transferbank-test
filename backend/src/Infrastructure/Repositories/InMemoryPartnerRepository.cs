using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Repositories;

public class InMemoryPartnerRepository : IPartnerRepository
{
    private readonly List<Partner> _partners = new();

    public Task<Partner?> GetByIdAsync(Guid id)
    {
        var partner = _partners.FirstOrDefault(p => p.Id == id);
        return Task.FromResult(partner);
    }

    public Task<Partner?> GetByCpfAsync(string cpf)
    {
        var partner = _partners.FirstOrDefault(p => p.Cpf == cpf);
        return Task.FromResult(partner);
    }

    public Task<IEnumerable<Partner>> GetByCompanyIdAsync(Guid companyId)
    {
        var partners = _partners.Where(p => p.CompanyId == companyId);
        return Task.FromResult(partners);
    }

    public Task<IEnumerable<Partner>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<Partner>>(_partners);
    }

    public Task<Partner> AddAsync(Partner partner)
    {
        _partners.Add(partner);
        return Task.FromResult(partner);
    }

    public Task<Partner> UpdateAsync(Partner partner)
    {
        var index = _partners.FindIndex(p => p.Id == partner.Id);
        if (index >= 0)
        {
            _partners[index] = partner;
        }
        return Task.FromResult(partner);
    }

    public Task<bool> ExistsByCpfAsync(string cpf)
    {
        var exists = _partners.Any(p => p.Cpf == cpf);
        return Task.FromResult(exists);
    }

    public Task<decimal> GetTotalShareholdingByCompanyAsync(Guid companyId)
    {
        var total = _partners
            .Where(p => p.CompanyId == companyId)
            .Sum(p => p.Shareholding);
        return Task.FromResult(total);
    }
}
