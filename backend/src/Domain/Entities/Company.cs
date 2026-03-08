using Domain.Enums;

namespace Domain.Entities;

public class Company
{
    public Guid Id { get; private set; }
    public string Cnpj { get; private set; }
    public string CompanyName { get; private set; }
    public string FullName { get; private set; }
    public CryptoCurrencyEnum[] CryptoCurrencies { get; private set; }
    public string Phone { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public List<Partner> Partners { get; private set; }

    private Company() 
    {
        Partners = new List<Partner>();
    }

    public Company(
        string cnpj,
        string companyName,
        string fullName,
        CryptoCurrencyEnum[] cryptoCurrencies,
        string phone,
        string email,
        string passwordHash)
    {
        Id = Guid.NewGuid();
        Cnpj = cnpj ?? throw new ArgumentNullException(nameof(cnpj));
        CompanyName = companyName ?? throw new ArgumentNullException(nameof(companyName));
        FullName = fullName ?? throw new ArgumentNullException(nameof(fullName));
        CryptoCurrencies = cryptoCurrencies ?? throw new ArgumentNullException(nameof(cryptoCurrencies));
        Phone = phone ?? throw new ArgumentNullException(nameof(phone));
        Email = email ?? throw new ArgumentNullException(nameof(email));
        PasswordHash = passwordHash ?? throw new ArgumentNullException(nameof(passwordHash));
        CreatedAt = DateTime.UtcNow;
        Partners = new List<Partner>();

        Validate();
    }

    public void AddPartner(Partner partner)
    {
        if (partner == null)
            throw new ArgumentNullException(nameof(partner));

        Partners.Add(partner);
        UpdatedAt = DateTime.UtcNow;
    }

    public decimal GetTotalShareholding()
    {
        return Partners.Sum(p => p.Shareholding);
    }

    public bool IsShareholdingComplete()
    {
        return Math.Abs(GetTotalShareholding() - 100) < 0.01m;
    }

    private void Validate()
    {
        if (string.IsNullOrWhiteSpace(Cnpj))
            throw new ArgumentException("CNPJ cannot be empty", nameof(Cnpj));

        if (string.IsNullOrWhiteSpace(Email))
            throw new ArgumentException("Email cannot be empty", nameof(Email));

        if (CryptoCurrencies == null || CryptoCurrencies.Length == 0)
            throw new ArgumentException("At least one cryptocurrency must be selected", nameof(CryptoCurrencies));
    }
}
