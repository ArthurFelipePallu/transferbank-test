using Domain.Enums;

namespace Domain.Models;

public class CompanyDto
{
    public string Cnpj { get; set; }
    public string CompanyName { get; set; }
    public string FullName { get; set; }
    public CryptoCurrencyEnum[] CryptoCurrencies { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

    public CompanyDto(string cnpj, string companyName, CryptoCurrencyEnum[] cryptos ,string fullName, string phone, string email, string password)
    {
        Cnpj = cnpj;
        CompanyName = companyName;
        FullName = fullName;
        CryptoCurrencies = cryptos;
        Phone = phone;
        Email = email;
        Password = password;
    }
}