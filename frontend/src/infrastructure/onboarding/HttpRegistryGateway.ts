import { api } from '@/api/apiClient'
import { type RegisterCompanyRequest } from '@/api/backendApi'
import type { OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'
import type { RegistryGateway } from '@/domain/onboarding/ports/RegistryGateway'

const mapToRegisterCompanyRequest = (input: OnboardingFormValues): RegisterCompanyRequest => ({
  cnpj: input.cnpj,
  companyName: input.companyName,
  fantasyName: input.fantasyName,
  cryptoCurrencies: input.cryptoCurrencies,
  phone: input.phone,
  email: input.email,
  password: input.password,
})

export const httpRegistryGateway: RegistryGateway = {
  async register(data) {
    const dto = mapToRegisterCompanyRequest(data)
    await api.company.companyRegisterCreate(dto)
  },
}
