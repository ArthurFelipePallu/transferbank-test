using Application.Interfaces;
using Application.Services;
using Domain.Interfaces;
using Infrastructure.Repositories;
using Infrastructure.Localization;
using Api.Middleware;

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

// Register repositories (Infrastructure layer)
builder.Services.AddSingleton<ICompanyRepository, InMemoryCompanyRepository>();
builder.Services.AddSingleton<IPartnerRepository, InMemoryPartnerRepository>();

// Register localization service
builder.Services.AddScoped<ILocalizationService, LocalizationService>();

// Register services (Application layer)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IPartnerService, PartnerService>();

var app = builder.Build();

// Enable Swagger in all environments for this project
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");
app.UseMiddleware<LocalizationMiddleware>();

// Cloud Run terminates TLS externally — only redirect in development
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.MapControllers();

app.Run();
