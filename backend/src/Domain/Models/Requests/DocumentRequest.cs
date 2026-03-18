using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Requests;

/// <summary>
/// Document metadata submitted with a partner registration.
/// File content is not stored — only metadata for audit purposes.
/// </summary>
public class DocumentRequest
{
    [Required(ErrorMessage = "Document name is required")]
    [MinLength(1, ErrorMessage = "Document name cannot be empty")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Document size is required")]
    [Range(1, long.MaxValue, ErrorMessage = "Document size must be greater than 0")]
    public long Size { get; set; }

    [Required(ErrorMessage = "Document type is required")]
    [MinLength(1, ErrorMessage = "Document type cannot be empty")]
    public string Type { get; set; } = string.Empty;
}
