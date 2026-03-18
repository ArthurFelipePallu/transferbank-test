using Domain.Entities;
using Domain.Models.Responses;

namespace Application.Mappers;

/// <summary>
/// Pure static mapper — Partner entity → PartnerResponse DTO.
/// No dependencies, no side effects, trivially testable.
/// </summary>
public static class PartnerMapper
{
    public static PartnerResponse ToResponse(Partner partner) => new()
    {
        Id = partner.Id,
        CompanyId = partner.CompanyId,
        FullName = partner.FullName,
        Cpf = partner.Cpf,
        Nationality = partner.Nationality,
        Shareholding = partner.Shareholding,
        IsPep = partner.IsPep,
        Documents = partner.Documents.Select(ToDocumentResponse).ToList(),
        CreatedAt = partner.CreatedAt,
    };

    public static DocumentResponse ToDocumentResponse(Document document) => new()
    {
        Id = document.Id,
        Name = document.Name,
        Size = document.Size,
        Type = document.Type,
        UploadedAt = document.UploadedAt,
    };
}
