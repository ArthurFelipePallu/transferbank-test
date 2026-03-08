using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Requests;

public class RegisterPartnerRequest
{
    [Required(ErrorMessage = "Company ID is required")]
    public Guid CompanyId { get; set; }

    [Required(ErrorMessage = "Full name is required")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "CPF is required")]
    public string Cpf { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nationality is required")]
    public string Nationality { get; set; } = string.Empty;

    [Required(ErrorMessage = "Shareholding is required")]
    [Range(0.01, 100, ErrorMessage = "Shareholding must be between 0.01 and 100")]
    public decimal Shareholding { get; set; }

    public bool IsPep { get; set; }

    public List<DocumentRequest> Documents { get; set; } = new();
}

public class DocumentRequest
{
    [Required(ErrorMessage = "Document name is required")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Document size is required")]
    public long Size { get; set; }

    [Required(ErrorMessage = "Document type is required")]
    public string Type { get; set; } = string.Empty;
}
