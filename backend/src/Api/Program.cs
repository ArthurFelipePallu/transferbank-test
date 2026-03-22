using Application.Interfaces;
using Application.Options;
using Application.Services;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Localization;
using Infrastructure.ExternalServices;
using Api.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()
        );
    });

// Read allowed origins from config — supports multiple comma-separated values
var allowedOrigins = builder.Configuration
    .GetValue<string>("Cors:AllowedOrigins")?
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SchemaGeneratorOptions.UseInlineDefinitionsForEnums = false;
});

// Named HttpClient for the CNPJ proxy — 10s timeout matches frontend expectation
builder.Services.AddHttpClient("CnpjApi", client =>
{
    client.Timeout = TimeSpan.FromSeconds(10);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    client.DefaultRequestHeaders.Add("User-Agent", "TransferBank-API/1.0");
});

// Named HttpClient for OCR.space proxy
builder.Services.AddHttpClient("OcrSpaceApi", client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
});

// Named HttpClient for OpenAI proxy
builder.Services.AddHttpClient("OpenAiApi", client =>
{
    client.Timeout = TimeSpan.FromSeconds(60);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

// Register repositories (Infrastructure layer — SQLite via EF Core)
var dbPath = builder.Configuration.GetValue<string>("Database:Path") ?? "transferbank.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));
builder.Services.AddScoped<ICompanyRepository, EfCompanyRepository>();
builder.Services.AddScoped<IPartnerRepository, EfPartnerRepository>();

// Register localization service
builder.Services.AddScoped<ILocalizationService, LocalizationService>();

// Register services (Application layer)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IPartnerService, PartnerService>();

// Bind typed options for external services
builder.Services.Configure<OcrSpaceOptions>(
    builder.Configuration.GetSection(OcrSpaceOptions.SectionName));
builder.Services.Configure<OpenAiOptions>(
    builder.Configuration.GetSection(OpenAiOptions.SectionName));

// Register external service implementations (Infrastructure → Application interfaces)
builder.Services.AddScoped<IOcrService, OcrSpaceService>();
builder.Services.AddScoped<IDocumentAnalysisService, OpenAiDocumentAnalysisService>();

var app = builder.Build();

// Auto-migrate on startup — creates the SQLite file and schema if not present
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Enable Swagger in all environments for this project
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");
app.UseMiddleware<LocalizationMiddleware>();
app.UseMiddleware<GlobalExceptionMiddleware>();

// Cloud Run terminates TLS externally — only redirect in development
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.MapControllers();

app.Run();
