using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Requests;

public class UpdatePartnerRequest
{
    [Required(ErrorMessage = "Full name is required")]
    [MinLength(2, ErrorMessage = "Full name must be at least 2 characters")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nationality is required")]
    public string Nationality { get; set; } = string.Empty;

    [Required(ErrorMessage = "Shareholding is required")]
    [Range(0.01, 100, ErrorMessage = "Shareholding must be between 0.01 and 100")]
    public decimal Shareholding { get; set; }

    public bool IsPep { get; set; }

    public List<DocumentRequest> Documents { get; set; } = new();
}
