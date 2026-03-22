using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class EfPartnerRepository : IPartnerRepository
{
    private readonly AppDbContext _db;

    public EfPartnerRepository(AppDbContext db) => _db = db;

    public async Task<Partner?> GetByIdAsync(Guid id)
        => await _db.Partners.FindAsync(id);

    public async Task<Partner?> GetByCpfAsync(string cpf)
        => await _db.Partners.FirstOrDefaultAsync(p => p.Cpf == cpf);

    public async Task<IEnumerable<Partner>> GetByCompanyIdAsync(Guid companyId)
        => await _db.Partners.Where(p => p.CompanyId == companyId).ToListAsync();

    public async Task<IEnumerable<Partner>> GetAllAsync()
        => await _db.Partners.ToListAsync();

    public async Task<Partner> AddAsync(Partner partner)
    {
        _db.Partners.Add(partner);
        await _db.SaveChangesAsync();
        return partner;
    }

    public async Task<Partner> UpdateAsync(Partner partner)
    {
        _db.Partners.Update(partner);
        await _db.SaveChangesAsync();
        return partner;
    }

    public async Task<bool> ExistsByCpfAsync(string cpf)
        => await _db.Partners.AnyAsync(p => p.Cpf == cpf);

    public async Task<decimal> GetTotalShareholdingByCompanyAsync(Guid companyId)
        => await _db.Partners
            .Where(p => p.CompanyId == companyId)
            .SumAsync(p => p.Shareholding);
}
