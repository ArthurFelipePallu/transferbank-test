using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Requests;

/// <summary>
/// Partial update request — only non-null fields are applied to the partner.
/// CPF is intentionally excluded: it is immutable after registration.
/// </summary>
public class PatchPartnerRequest
{
    [MinLength(2, ErrorMessage = "Full name must be at least 2 characters")]
    public string? FullName { get; set; }

    public string? Nationality { get; set; }

    [Range(0.01, 100, ErrorMessage = "Shareholding must be between 0.01 and 100")]
    public decimal? Shareholding { get; set; }

    public bool? IsPep { get; set; }

    /// <summary>
    /// When provided, replaces the partner's document list entirely.
    /// When null, documents are left unchanged.
    /// </summary>
    public List<DocumentRequest>? Documents { get; set; }
}
