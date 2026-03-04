import type { OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'
import type { RegistryGateway } from '@/domain/onboarding/ports/RegistryGateway'

export const registerCompany = async (gateway: RegistryGateway, input: OnboardingFormValues) => {
  await gateway.register(input)
}
