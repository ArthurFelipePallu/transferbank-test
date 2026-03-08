namespace Domain.Models.Responses;

public class LoginResponse
{
    public Guid CompanyId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}
