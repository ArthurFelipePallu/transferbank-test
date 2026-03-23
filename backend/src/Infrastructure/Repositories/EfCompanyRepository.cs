using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class EfCompanyRepository : ICompanyRepository
{
    private readonly AppDbContext _db;

    public EfCompanyRepository(AppDbContext db) => _db = db;

    public async Task<Company?> GetByIdAsync(Guid id)
        => await _db.Companies.FindAsync(id);

    public async Task<Company?> GetByCnpjAsync(string cnpj)
        => await _db.Companies.FirstOrDefaultAsync(c => c.Cnpj == cnpj);

    public async Task<Company?> GetByEmailAsync(string email)
        => await _db.Companies.FirstOrDefaultAsync(c => c.Email == email);

    public async Task<IEnumerable<Company>> GetAllAsync()
        => await _db.Companies.ToListAsync();

    public async Task<Company> AddAsync(Company company)
    {
        _db.Companies.Add(company);
        await _db.SaveChangesAsync();
        return company;
    }

    public async Task<Company> UpdateAsync(Company company)
    {
        _db.Companies.Update(company);
        await _db.SaveChangesAsync();
        return company;
    }

    public async Task<bool> ExistsAsync(string cnpj, string email)
        => await _db.Companies.AnyAsync(c => c.Cnpj == cnpj || c.Email == email);

    public async Task<bool> ExistsByCnpjAsync(string cnpj)
        => await _db.Companies.AnyAsync(c => c.Cnpj == cnpj);

    public async Task<bool> ExistsByEmailAsync(string email)
        => await _db.Companies.AnyAsync(c => c.Email == email);
}
