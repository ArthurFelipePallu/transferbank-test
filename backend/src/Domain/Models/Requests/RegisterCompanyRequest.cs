using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Models.Requests;

public class RegisterCompanyRequest
{
    [Required(ErrorMessage = "CNPJ is required")]
    public string Cnpj { get; set; } = string.Empty;

    [Required(ErrorMessage = "Company name is required")]
    public string CompanyName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Fantasy name is required")]
    public string FantasyName { get; set; } = string.Empty;

    [Required(ErrorMessage = "At least one cryptocurrency is required")]
    [MinLength(1, ErrorMessage = "At least one cryptocurrency must be selected")]
    public CryptoCurrencyEnum[] CryptoCurrencies { get; set; } = Array.Empty<CryptoCurrencyEnum>();

    [Required(ErrorMessage = "Phone is required")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Partners collected during onboarding. Optional — a company may register
    /// without partners and add them later via the dedicated partner endpoint.
    /// </summary>
    public List<PartnerRegistrationDto> Partners { get; set; } = new();
}
