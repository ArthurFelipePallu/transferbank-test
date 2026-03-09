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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

// Add localization middleware
app.UseMiddleware<LocalizationMiddleware>();

app.UseHttpsRedirection();
app.MapControllers(); 

app.Run();