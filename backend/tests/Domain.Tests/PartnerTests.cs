using Domain.Entities;
using FluentAssertions;

namespace Domain.Tests;

public class PartnerTests
{
    [Fact]
    public void Constructor_WithValidData_ShouldCreatePartner()
    {
        // Arrange
        var companyId = Guid.NewGuid();
        var fullName = "John Doe";
        var cpf = "12345678901";
        var nationality = "Brazilian";
        var shareholding = 50m;
        var isPep = false;

        // Act
        var partner = new Partner(companyId, fullName, cpf, nationality, shareholding, isPep);

        // Assert
        partner.Should().NotBeNull();
        partner.Id.Should().NotBeEmpty();
        partner.CompanyId.Should().Be(companyId);
        partner.FullName.Should().Be(fullName);
        partner.Cpf.Should().Be(cpf);
        partner.Nationality.Should().Be(nationality);
        partner.Shareholding.Should().Be(shareholding);
        partner.IsPep.Should().Be(isPep);
        partner.Documents.Should().BeEmpty();
        partner.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Constructor_WithNullFullName_ShouldThrowArgumentNullException()
    {
        // Arrange & Act
        var act = () => new Partner(Guid.NewGuid(), null!, "12345678901", "Brazilian", 50, false);

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("fullName");
    }

    [Fact]
    public void Constructor_WithNullCpf_ShouldThrowArgumentNullException()
    {
        // Arrange & Act
        var act = () => new Partner(Guid.NewGuid(), "John Doe", null!, "Brazilian", 50, false);

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("cpf");
    }

    [Fact]
    public void Constructor_WithEmptyCpf_ShouldThrowArgumentException()
    {
        // Arrange & Act
        var act = () => new Partner(Guid.NewGuid(), "John Doe", "", "Brazilian", 50, false);

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("*CPF cannot be empty*");
    }

    [Fact]
    public void Constructor_WithNullNationality_ShouldThrowArgumentNullException()
    {
        // Arrange & Act
        var act = () => new Partner(Guid.NewGuid(), "John Doe", "12345678901", null!, 50, false);

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("nationality");
    }

    [Fact]
    public void Constructor_WithEmptyNationality_ShouldThrowArgumentException()
    {
        // Arrange & Act
        var act = () => new Partner(Guid.NewGuid(), "John Doe", "12345678901", "", 50, false);

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("*Nationality cannot be empty*");
    }

    [Fact]
    public void Constructor_WithZeroShareholding_ShouldThrowArgumentException()
    {
        // Arrange & Act
        var act = () => new Partner(Guid.NewGuid(), "John Doe", "12345678901", "Brazilian", 0, false);

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("*Shareholding must be between 0 and 100*");
    }

    [Fact]
    public void Constructor_WithNegativeShareholding_ShouldThrowArgumentException()
    {
        // Arrange & Act
        var act = () => new Partner(Guid.NewGuid(), "John Doe", "12345678901", "Brazilian", -10, false);

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("*Shareholding must be between 0 and 100*");
    }

    [Fact]
    public void Constructor_WithShareholdingOver100_ShouldThrowArgumentException()
    {
        // Arrange & Act
        var act = () => new Partner(Guid.NewGuid(), "John Doe", "12345678901", "Brazilian", 101, false);

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("*Shareholding must be between 0 and 100*");
    }

    [Fact]
    public void AddDocument_WithValidDocument_ShouldAddToList()
    {
        // Arrange
        var partner = CreateValidPartner();
        var document = new Document("passport.pdf", 1024, "application/pdf");

        // Act
        partner.AddDocument(document);

        // Assert
        partner.Documents.Should().HaveCount(1);
        partner.Documents.Should().Contain(document);
    }

    [Fact]
    public void AddDocument_WithNullDocument_ShouldThrowArgumentNullException()
    {
        // Arrange
        var partner = CreateValidPartner();

        // Act
        var act = () => partner.AddDocument(null!);

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("document");
    }

    [Fact]
    public void AddDocument_WithMultipleDocuments_ShouldAddAll()
    {
        // Arrange
        var partner = CreateValidPartner();
        var doc1 = new Document("passport.pdf", 1024, "application/pdf");
        var doc2 = new Document("id.pdf", 2048, "application/pdf");

        // Act
        partner.AddDocument(doc1);
        partner.AddDocument(doc2);

        // Assert
        partner.Documents.Should().HaveCount(2);
        partner.Documents.Should().Contain(new[] { doc1, doc2 });
    }

    private static Partner CreateValidPartner()
    {
        return new Partner(Guid.NewGuid(), "John Doe", "12345678901", "Brazilian", 50, false);
    }
}
