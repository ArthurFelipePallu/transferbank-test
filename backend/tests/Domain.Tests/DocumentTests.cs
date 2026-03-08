using Domain.Entities;
using FluentAssertions;

namespace Domain.Tests;

public class DocumentTests
{
    [Fact]
    public void Constructor_WithValidData_ShouldCreateDocument()
    {
        // Arrange
        var name = "passport.pdf";
        var size = 1024L;
        var type = "application/pdf";

        // Act
        var document = new Document(name, size, type);

        // Assert
        document.Should().NotBeNull();
        document.Id.Should().NotBeEmpty();
        document.Name.Should().Be(name);
        document.Size.Should().Be(size);
        document.Type.Should().Be(type);
        document.UploadedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Constructor_WithNullName_ShouldThrowArgumentNullException()
    {
        // Arrange & Act
        var act = () => new Document(null!, 1024, "application/pdf");

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("name");
    }

    [Fact]
    public void Constructor_WithNullType_ShouldThrowArgumentNullException()
    {
        // Arrange & Act
        var act = () => new Document("file.pdf", 1024, null!);

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("type");
    }

    [Fact]
    public void Constructor_WithZeroSize_ShouldCreateDocument()
    {
        // Arrange & Act
        var document = new Document("empty.txt", 0, "text/plain");

        // Assert
        document.Should().NotBeNull();
        document.Size.Should().Be(0);
    }

    [Fact]
    public void Constructor_WithLargeSize_ShouldCreateDocument()
    {
        // Arrange
        var largeSize = 10_000_000L; // 10MB

        // Act
        var document = new Document("large.pdf", largeSize, "application/pdf");

        // Assert
        document.Should().NotBeNull();
        document.Size.Should().Be(largeSize);
    }
}
