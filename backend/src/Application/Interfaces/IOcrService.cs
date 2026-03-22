namespace Application.Interfaces;

/// <summary>
/// Port: extracts plain text from a document file.
/// Implementations live in Infrastructure.
/// </summary>
public interface IOcrService
{
    /// <summary>
    /// Extracts text from the given file stream.
    /// </summary>
    /// <param name="fileStream">The document byte stream.</param>
    /// <param name="fileName">Original file name (used for content-type hints).</param>
    Task<string> ExtractTextAsync(Stream fileStream, string fileName);
}
