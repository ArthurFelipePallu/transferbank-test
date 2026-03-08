namespace Domain.Models.Responses;

public class PartnerResponse
{
    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Nationality { get; set; } = string.Empty;
    public decimal Shareholding { get; set; }
    public bool IsPep { get; set; }
    public List<DocumentResponse> Documents { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class DocumentResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public long Size { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}
