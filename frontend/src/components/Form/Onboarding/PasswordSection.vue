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
  <div class="password-section">
    <FormInputField 
      name="password" 
      :label="t('onboardingForm.password')" 
      type="password" 
      autocomplete="new-password"
      placeholder="Create a strong password"
    >
      <template #below>
        <div class="password-strength">
          <div class="password-strength-bar">
            <div 
              class="password-strength-bar-fill" 
              :class="passwordStrengthClass"
              :style="{ width: passwordStrengthPercent + '%' }" 
            />
          </div>
          <span class="password-strength-label">{{ passwordStrengthLabel }}</span>
        </div>

        <ul class="password-hints">
          <li>{{ t('onboardingForm.passwordHints.minLength') }}</li>
          <li>{{ t('onboardingForm.passwordHints.caseLetters') }}</li>
          <li>{{ t('onboardingForm.passwordHints.numbersSymbols') }}</li>
        </ul>
      </template>
    </FormInputField>

    <FormInputField 
      name="passwordConfirmation" 
      :label="t('onboardingForm.confirmPassword')" 
      type="password" 
      autocomplete="new-password"
      placeholder="Repeat your password" 
      :validate-on-input="true" 
    />
  </div>
</template>

<style scoped>
.password-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.3rem;
}

.password-strength-bar {
  flex: 1;
  height: 0.35rem;
  border-radius: 999px;
  background: var(--color-surface-border);
  overflow: hidden;
}

.password-strength-bar-fill {
  height: 100%;
  width: 0;
  transition:
    width 0.2s ease,
    background 0.2s ease;
}

.strength-empty {
  background: transparent;
}

.strength-weak {
  background: var(--color-error);
}

.strength-medium {
  background: var(--color-warning);
}

.strength-strong {
  background: var(--color-primary-teal-light);
}

.password-strength-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  min-width: 4.5rem;
}

.password-hints {
  margin: 0.35rem 0 0;
  padding-left: 1.2rem;
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.password-hints li + li {
  margin-top: 0.1rem;
}

@media (min-width: 640px) {
  .password-section {
    gap: 1.25rem;
  }
}
</style>
