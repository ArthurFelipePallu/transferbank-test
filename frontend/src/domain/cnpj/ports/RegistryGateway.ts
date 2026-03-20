import type { OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'

export interface RegistryGateway {
  register(data: OnboardingFormValues): Promise<void>
}
