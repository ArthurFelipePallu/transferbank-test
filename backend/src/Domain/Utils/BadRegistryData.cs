using Domain.Enums;
using Domain.Models;

namespace Domain.Utils;

public class BadRegistryData
{
    public CompanyDto badCompany;

    public BadRegistryData()
    {
        badCompany = new CompanyDto(    "123",
                                        "123",
                                        Array.Empty<CryptoCurrencyEnum>(),
                                        "123",
                                        "123",
                                        "123",
                                        "123");
    }
    
}