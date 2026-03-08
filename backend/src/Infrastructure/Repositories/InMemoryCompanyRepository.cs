using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Repositories;

public class InMemoryCompanyRepository : ICompanyRepository
{
    private readonly List<Company> _companies = new();

    public Task<Company?> GetByIdAsync(Guid id)
    {
        var company = _companies.FirstOrDefault(c => c.Id == id);
        return Task.FromResult(company);
    }

    public Task<Company?> GetByCnpjAsync(string cnpj)
    {
        var company = _companies.FirstOrDefault(c => c.Cnpj == cnpj);
        return Task.FromResult(company);
    }

    public Task<Company?> GetByEmailAsync(string email)
    {
        var company = _companies.FirstOrDefault(c => c.Email == email);
        return Task.FromResult(company);
    }

    public Task<IEnumerable<Company>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<Company>>(_companies);
    }

    public Task<Company> AddAsync(Company company)
    {
        _companies.Add(company);
        return Task.FromResult(company);
    }

    public Task<Company> UpdateAsync(Company company)
    {
        var index = _companies.FindIndex(c => c.Id == company.Id);
        if (index >= 0)
        {
            _companies[index] = company;
        }
        return Task.FromResult(company);
    }

    public Task<bool> ExistsAsync(string cnpj, string email)
    {
        var exists = _companies.Any(c => c.Cnpj == cnpj || c.Email == email);
        return Task.FromResult(exists);
    }
}
