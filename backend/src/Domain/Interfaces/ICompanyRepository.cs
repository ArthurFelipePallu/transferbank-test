using Domain.Entities;

namespace Domain.Interfaces;

public interface ICompanyRepository
{
    Task<Company?> GetByIdAsync(Guid id);
    Task<Company?> GetByCnpjAsync(string cnpj);
    Task<Company?> GetByEmailAsync(string email);
    Task<IEnumerable<Company>> GetAllAsync();
    Task<Company> AddAsync(Company company);
    Task<Company> UpdateAsync(Company company);
    Task<bool> ExistsAsync(string cnpj, string email);
}
