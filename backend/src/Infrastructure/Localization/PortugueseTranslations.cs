namespace Infrastructure.Localization;

public static class PortugueseTranslations
{
    public static Dictionary<string, string> GetTranslations()
    {
        return new Dictionary<string, string>
        {
            // Validation errors
            ["Validation.Required"] = "{field} é obrigatório",
            ["Validation.Email"] = "Formato de e-mail inválido",
            ["Validation.MinLength"] = "{field} deve ter pelo menos {min} caracteres",
            ["Validation.MaxLength"] = "{field} deve ter no máximo {max} caracteres",
            ["Validation.InvalidFormat"] = "Formato de {field} inválido",

            // Authentication
            ["Auth.InvalidCredentials"] = "E-mail ou senha inválidos",
            ["Auth.SessionExpired"] = "Sua sessão expirou. Por favor, faça login novamente.",
            ["Auth.Unauthorized"] = "Você não está autorizado a realizar esta ação",

            // Company errors
            ["Company.AlreadyExists"] = "Empresa com este CNPJ ou E-mail já existe",
            ["Company.NotFound"] = "Empresa não encontrada. Verifique o ID da empresa.",
            ["Company.InvalidCnpj"] = "Formato de CNPJ inválido",
            ["Company.NoCryptocurrencies"] = "Pelo menos uma criptomoeda deve ser selecionada",

            // Partner errors
            ["Partner.AlreadyExists"] = "Sócio com este CPF já existe",
            ["Partner.NotFound"] = "Sócio não encontrado. Verifique o ID do sócio.",
            ["Partner.InvalidCpf"] = "Formato de CPF inválido",
            ["Partner.InvalidShareholding"] = "Participação deve estar entre 0.01 e 100",
            ["Partner.ShareholdingExceeded"] = "Participação total não pode exceder 100%",

            // Generic errors
            ["Error.InternalServer"] = "Ocorreu um erro. Por favor, tente novamente.",
            ["Error.NotFound"] = "Recurso não encontrado",
            ["Error.BadRequest"] = "Requisição inválida. Verifique sua entrada.",
            ["Error.Conflict"] = "Este recurso já existe",
            ["Error.Forbidden"] = "Acesso negado",

            // Success messages
            ["Success.CompanyRegistered"] = "Empresa registrada com sucesso",
            ["Success.PartnerRegistered"] = "Sócio registrado com sucesso",
            ["Success.LoginSuccessful"] = "Login realizado com sucesso",
        };
    }
}
