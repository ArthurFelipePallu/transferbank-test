<script setup lang="ts">
import { computed } from 'vue'
import FormInputField from '../FormInputField.vue'
import { useTranslation } from '@/composables/useTranslation'

interface Props {
  password: string
}

const props = defineProps<Props>()

const { t } = useTranslation()

const passwordScore = computed(() => {
  let score = 0
  const value = props.password || ''

  if (value.length >= 8) score++
  if (/[A-Z]/.test(value)) score++
  if (/[a-z]/.test(value)) score++
  if (/[0-9]/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++

  return score
})

const passwordStrengthLabel = computed(() => {
  if (!props.password) return t('onboardingForm.passwordStrength.enterPassword')
  if (passwordScore.value <= 2) return t('onboardingForm.passwordStrength.weak')
  if (passwordScore.value === 3 || passwordScore.value === 4) return t('onboardingForm.passwordStrength.medium')
  return t('onboardingForm.passwordStrength.strong')
})

const passwordStrengthPercent = computed(() => {
  return (passwordScore.value / 5) * 100
})

const passwordStrengthClass = computed(() => {
  if (!props.password) return 'strength-empty'
  if (passwordScore.value <= 2) return 'strength-weak'
  if (passwordScore.value === 3 || passwordScore.value === 4) return 'strength-medium'
  return 'strength-strong'
})
</script>

<template>
  <div class="row g-3">
    <div class="col-12">
      <FormInputField 
        name="password" 
        :label="t('onboardingForm.password')" 
        type="password" 
        autocomplete="new-password"
        placeholder="Create a strong password"
      >
        <template #below>
          <div class="d-flex align-items-center gap-2 mt-2">
            <div class="progress flex-grow-1" style="height: 6px;">
              <div 
                class="progress-bar" 
                :class="passwordStrengthClass"
                :style="{ width: passwordStrengthPercent + '%' }" 
                role="progressbar"
                :aria-valuenow="passwordScore"
                aria-valuemin="0"
                aria-valuemax="5"
              />
            </div>
            <span class="text-muted small" style="min-width: 4.5rem;">{{ passwordStrengthLabel }}</span>
          </div>

          <ul class="small text-muted mt-2 mb-0 ps-3">
            <li>{{ t('onboardingForm.passwordHints.minLength') }}</li>
            <li>{{ t('onboardingForm.passwordHints.caseLetters') }}</li>
            <li>{{ t('onboardingForm.passwordHints.numbersSymbols') }}</li>
          </ul>
        </template>
      </FormInputField>
    </div>

    <div class="col-12">
      <FormInputField 
        name="passwordConfirmation" 
        :label="t('onboardingForm.confirmPassword')" 
        type="password" 
        autocomplete="new-password"
        placeholder="Repeat your password" 
        :validate-on-input="true" 
      />
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  transition: width 0.2s ease, background-color 0.2s ease;
}

.strength-empty {
  background-color: transparent;
}

.strength-weak {
  background-color: var(--bs-danger);
}

.strength-medium {
  background-color: var(--bs-warning);
}

.strength-strong {
  background-color: var(--bs-success);
}
</style>
