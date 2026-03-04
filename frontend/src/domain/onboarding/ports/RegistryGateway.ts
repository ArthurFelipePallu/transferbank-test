import type { OnboardingFormValues } from '../onboarding.schema'

export interface RegistryGateway {
  register(data: OnboardingFormValues): Promise<void>
}

