import { api } from '@/api/apiClient'
import { type CompanyDto } from '@/api/backendApi'
import type { OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'
import type { RegistryGateway } from '@/domain/onboarding/ports/RegistryGateway'

const mapToCompanyDto = (input: OnboardingFormValues): CompanyDto => ({
  cnpj: input.cnpj,
  companyName: input.companyName,
  fullName: input.fullName,
  cryptoCurrencies: input.cryptoCurrencies,
  phone: input.phone,
  email: input.email,
  password: input.password,
})

export const httpRegistryGateway: RegistryGateway = {
  async register(data) {
    const dto = mapToCompanyDto(data)
    await api.registry.registryRegisterCreate(dto)
  },
}
