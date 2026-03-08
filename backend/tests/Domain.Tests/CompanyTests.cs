using Domain.Entities;
using Domain.Enums;
using FluentAssertions;

namespace Domain.Tests;

public class CompanyTests
{
    [Fact]
    public void Constructor_WithValidData_ShouldCreateCompany()
    {
        // Arrange
        var cnpj = "12345678000190";
        var companyName = "Test Company";
        var fullName = "Test Company LTDA";
        var cryptoCurrencies = new[] { CryptoCurrencyEnum.Bitcoin, CryptoCurrencyEnum.Ethereum };
        var phone = "+5511999999999";
        var email = "test@company.com";
        var passwordHash = "hashedPassword123";

        // Act
        var company = new Company(cnpj, companyName, fullName, cryptoCurrencies, phone, email, passwordHash);

        // Assert
        company.Should().NotBeNull();
        company.Id.Should().NotBeEmpty();
        company.Cnpj.Should().Be(cnpj);
        company.CompanyName.Should().Be(companyName);
        company.FullName.Should().Be(fullName);
        company.CryptoCurrencies.Should().BeEquivalentTo(cryptoCurrencies);
        company.Phone.Should().Be(phone);
        company.Email.Should().Be(email);
        company.PasswordHash.Should().Be(passwordHash);
        company.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        company.UpdatedAt.Should().BeNull();
        company.Partners.Should().BeEmpty();
    }

    [Fact]
    public void Constructor_WithNullCnpj_ShouldThrowArgumentNullException()
    {
        // Arrange & Act
        var act = () => new Company(null!, "Company", "Full Name", 
            new[] { CryptoCurrencyEnum.Bitcoin }, "+5511999999999", "test@test.com", "hash");

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("cnpj");
    }

    [Fact]
    public void Constructor_WithEmptyCnpj_ShouldThrowArgumentException()
    {
        // Arrange & Act
        var act = () => new Company("", "Company", "Full Name", 
            new[] { CryptoCurrencyEnum.Bitcoin }, "+5511999999999", "test@test.com", "hash");

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("*CNPJ cannot be empty*");
    }

    [Fact]
    public void Constructor_WithNullEmail_ShouldThrowArgumentNullException()
    {
        // Arrange & Act
        var act = () => new Company("12345678000190", "Company", "Full Name", 
            new[] { CryptoCurrencyEnum.Bitcoin }, "+5511999999999", null!, "hash");

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("email");
    }

    [Fact]
    public void Constructor_WithEmptyEmail_ShouldThrowArgumentException()
    {
        // Arrange & Act
        var act = () => new Company("12345678000190", "Company", "Full Name", 
            new[] { CryptoCurrencyEnum.Bitcoin }, "+5511999999999", "", "hash");

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("*Email cannot be empty*");
    }

    [Fact]
    public void Constructor_WithNullCryptoCurrencies_ShouldThrowArgumentNullException()
    {
        // Arrange & Act
        var act = () => new Company("12345678000190", "Company", "Full Name", 
            null!, "+5511999999999", "test@test.com", "hash");

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("cryptoCurrencies");
    }

    [Fact]
    public void Constructor_WithEmptyCryptoCurrencies_ShouldThrowArgumentException()
    {
        // Arrange & Act
        var act = () => new Company("12345678000190", "Company", "Full Name", 
            Array.Empty<CryptoCurrencyEnum>(), "+5511999999999", "test@test.com", "hash");

        // Assert
        act.Should().Throw<ArgumentException>()
            .WithMessage("*At least one cryptocurrency must be selected*");
    }

    [Fact]
    public void AddPartner_WithValidPartner_ShouldAddToList()
    {
        // Arrange
        var company = CreateValidCompany();
        var partner = CreateValidPartner(company.Id);

        // Act
        company.AddPartner(partner);

        // Assert
        company.Partners.Should().HaveCount(1);
        company.Partners.Should().Contain(partner);
        company.UpdatedAt.Should().NotBeNull();
        company.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void AddPartner_WithNullPartner_ShouldThrowArgumentNullException()
    {
        // Arrange
        var company = CreateValidCompany();

        // Act
        var act = () => company.AddPartner(null!);

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("partner");
    }

    [Fact]
    public void GetTotalShareholding_WithNoPartners_ShouldReturnZero()
    {
        // Arrange
        var company = CreateValidCompany();

        // Act
        var total = company.GetTotalShareholding();

        // Assert
        total.Should().Be(0);
    }

    [Fact]
    public void GetTotalShareholding_WithMultiplePartners_ShouldReturnSum()
    {
        // Arrange
        var company = CreateValidCompany();
        var partner1 = new Partner(company.Id, "Partner 1", "12345678901", "Brazilian", 30, false);
        var partner2 = new Partner(company.Id, "Partner 2", "98765432109", "Brazilian", 45, false);
        company.AddPartner(partner1);
        company.AddPartner(partner2);

        // Act
        var total = company.GetTotalShareholding();

        // Assert
        total.Should().Be(75);
    }

    [Fact]
    public void IsShareholdingComplete_WithExactly100Percent_ShouldReturnTrue()
    {
        // Arrange
        var company = CreateValidCompany();
        var partner1 = new Partner(company.Id, "Partner 1", "12345678901", "Brazilian", 60, false);
        var partner2 = new Partner(company.Id, "Partner 2", "98765432109", "Brazilian", 40, false);
        company.AddPartner(partner1);
        company.AddPartner(partner2);

        // Act
        var isComplete = company.IsShareholdingComplete();

        // Assert
        isComplete.Should().BeTrue();
    }

    [Fact]
    public void IsShareholdingComplete_WithLessThan100Percent_ShouldReturnFalse()
    {
        // Arrange
        var company = CreateValidCompany();
        var partner = new Partner(company.Id, "Partner 1", "12345678901", "Brazilian", 50, false);
        company.AddPartner(partner);

        // Act
        var isComplete = company.IsShareholdingComplete();

        // Assert
        isComplete.Should().BeFalse();
    }

    private static Company CreateValidCompany()
    {
        return new Company(
            "12345678000190",
            "Test Company",
            "Test Company LTDA",
            new[] { CryptoCurrencyEnum.Bitcoin },
            "+5511999999999",
            "test@company.com",
            "hashedPassword"
        );
    }

    private static Partner CreateValidPartner(Guid companyId)
    {
        return new Partner(companyId, "John Doe", "12345678901", "Brazilian", 50, false);
    }
}
