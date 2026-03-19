namespace Domain.Entities;

public class Partner
{
    public Guid Id { get; private set; }
    public Guid CompanyId { get; private set; }
    public string FullName { get; private set; }
    public string Cpf { get; private set; }
    public string Nationality { get; private set; }
    public decimal Shareholding { get; private set; }
    public bool IsPep { get; private set; }
    public List<Document> Documents { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Partner() 
    {
        Documents = new List<Document>();
    }

    public Partner(
        Guid companyId,
        string fullName,
        string cpf,
        string nationality,
        decimal shareholding,
        bool isPep)
    {
        Id = Guid.NewGuid();
        CompanyId = companyId;
        FullName = fullName ?? throw new ArgumentNullException(nameof(fullName));
        Cpf = cpf ?? throw new ArgumentNullException(nameof(cpf));
        Nationality = nationality ?? throw new ArgumentNullException(nameof(nationality));
        Shareholding = shareholding;
        IsPep = isPep;
        Documents = new List<Document>();
        CreatedAt = DateTime.UtcNow;

        Validate();
    }

    public void AddDocument(Document document)
    {
        if (document == null)
            throw new ArgumentNullException(nameof(document));

        Documents.Add(document);
    }

    public void Update(string fullName, string nationality, decimal shareholding, bool isPep)
    {
        FullName = fullName ?? throw new ArgumentNullException(nameof(fullName));
        Nationality = nationality ?? throw new ArgumentNullException(nameof(nationality));
        Shareholding = shareholding;
        IsPep = isPep;
        Validate();
    }

    /// <summary>
    /// Applies only the non-null fields from a partial update.
    /// Each field is independent — unset fields are left unchanged.
    /// </summary>
    public void Patch(string? fullName, string? nationality, decimal? shareholding, bool? isPep)
    {
        if (fullName is not null)     FullName     = fullName;
        if (nationality is not null)  Nationality  = nationality;
        if (shareholding is not null) Shareholding = shareholding.Value;
        if (isPep is not null)        IsPep        = isPep.Value;
        Validate();
    }

    public void ReplaceDocuments(IEnumerable<Document> documents)
    {
        Documents = documents?.ToList() ?? throw new ArgumentNullException(nameof(documents));
    }

    private void Validate()
    {
        if (string.IsNullOrWhiteSpace(Cpf))
            throw new ArgumentException("CPF cannot be empty", nameof(Cpf));

        if (string.IsNullOrWhiteSpace(Nationality))
            throw new ArgumentException("Nationality cannot be empty", nameof(Nationality));

        if (Shareholding <= 0 || Shareholding > 100)
            throw new ArgumentException("Shareholding must be between 0 and 100", nameof(Shareholding));
    }
}

public class Document
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public long Size { get; private set; }
    public string Type { get; private set; }
    public DateTime UploadedAt { get; private set; }

    public Document(string name, long size, string type)
    {
        Id = Guid.NewGuid();
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Size = size;
        Type = type ?? throw new ArgumentNullException(nameof(type));
        UploadedAt = DateTime.UtcNow;
    }
}
