using Domain.Entities;
using Domain.Models.Requests;
using Domain.Models.Responses;

namespace Application.Interfaces;

public interface ICompanyService
{
    Task<CompanyResponse> RegisterAsync(RegisterCompanyRequest request);
    Task<CompanyResponse?> GetByIdAsync(Guid id);
    Task<CompanyResponse?> GetByCnpjAsync(string cnpj);
    Task<IEnumerable<CompanyResponse>> GetAllAsync();
    Task<bool> ExistsAsync(string cnpj, string email);
}
