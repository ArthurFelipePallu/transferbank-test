using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

namespace Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Partner> Partners  => Set<Partner>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ── Company ──────────────────────────────────────────────────────────
        modelBuilder.Entity<Company>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Cnpj).IsRequired().HasMaxLength(14);
            e.Property(c => c.Email).IsRequired().HasMaxLength(256);
            e.HasIndex(c => c.Cnpj).IsUnique();
            e.HasIndex(c => c.Email).IsUnique();

            // Store CryptoCurrencyEnum[] as JSON string
            var cryptoConverter = new ValueConverter<CryptoCurrencyEnum[], string>(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<CryptoCurrencyEnum[]>(v, (JsonSerializerOptions?)null) ?? Array.Empty<CryptoCurrencyEnum>()
            );
            var cryptoComparer = new ValueComparer<CryptoCurrencyEnum[]>(
                (a, b) => a != null && b != null && a.SequenceEqual(b),
                v => v.Aggregate(0, (h, e) => HashCode.Combine(h, e.GetHashCode())),
                v => v.ToArray()
            );
            e.Property(c => c.CryptoCurrencies)
             .HasConversion(cryptoConverter, cryptoComparer);

            // Ignore navigation — partners are loaded via IPartnerRepository
            e.Ignore(c => c.Partners);
        });

        // ── Partner ───────────────────────────────────────────────────────────
        modelBuilder.Entity<Partner>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Cpf).IsRequired().HasMaxLength(11);

            // Store Documents as JSON
            var docsConverter = new ValueConverter<List<Document>, string>(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<Document>>(v, (JsonSerializerOptions?)null) ?? new List<Document>()
            );
            var docsComparer = new ValueComparer<List<Document>>(
                (a, b) => a != null && b != null && a.Count == b.Count,
                v => v.Count,
                v => v.ToList()
            );
            e.Property(p => p.Documents)
             .HasConversion(docsConverter, docsComparer);
        });
    }
}
