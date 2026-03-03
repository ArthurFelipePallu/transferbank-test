using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Models;

public class CompanyDto
{
    [property: Required] public string Cnpj { get; set; }
    [property: Required] public string CompanyName { get; set; }
    [property: Required] public string FullName { get; set; }
    [property: Required] public CryptoCurrencyEnum[] CryptoCurrencies { get; set; }
    [property: Required] public string Phone { get; set; }
    [property: Required] public string Email { get; set; }
    [property: Required] public string Password { get; set; }

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