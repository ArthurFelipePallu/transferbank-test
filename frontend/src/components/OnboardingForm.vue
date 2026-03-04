<script setup lang="ts">
import CryptoChip from './CryptoChip.vue'
import { computed, onMounted, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import FormInputField from './FormInputField.vue'
import { CryptoCurrencyEnum } from '@/api/backendApi'
import { type OnboardingFormValues, onboardingSchema } from '@/domain/onboarding/onboarding.schema'
import { loadCurrenciesWithHighlight } from '@/application/onboarding/cryptoCurrencyUseCase'
import { httpCurrencyGateway } from '@/infrastructure/onboarding/HttpCurrencyGateway'
import type { CryptoCurrencyOption } from '@/domain/onboarding/interfaces/currencyInterface'

const cryptoCurrencies = ref<CryptoCurrencyOption[]>([])

onMounted(async () => {
  cryptoCurrencies.value = await loadCurrenciesWithHighlight(httpCurrencyGateway)
})

const props = withDefaults(
  defineProps<{
    submitLabel?: string
    hintText?: string
  }>(),
  {
    submitLabel: 'Create account',
    hintText:
      'This onboarding is optimized for both web and mobile. You can continue from any device using the same credentials.',
  },
)

const emit = defineEmits<{
  submit: [values: OnboardingFormValues]
}>()

const validationSchema = toTypedSchema(onboardingSchema)

const { handleSubmit, meta, values, setFieldValue } = useForm<OnboardingFormValues>({
  validationSchema,
  initialValues: {
    cnpj: '',
    companyName: '',
    fullName: '',
    cryptoCurrencies: [],
    phone: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  },
})

const {
  errorMessage: cryptoError,
  meta: cryptoMeta,
  setTouched: setCryptoTouched,
} = useField<OnboardingFormValues['cryptoCurrencies']>('cryptoCurrencies')

const toggleCrypto = (symbol: CryptoCurrencyEnum) => {
  setCryptoTouched(true)
  const current = values.cryptoCurrencies ?? []
  if (current.includes(symbol)) {
    setFieldValue(
      'cryptoCurrencies',
      current.filter((c) => c !== symbol),
    )
  } else {
    setFieldValue('cryptoCurrencies', [...current, symbol])
  }
}

const passwordScore = computed(() => {
  let score = 0
  const value = values.password || ''

  if (value.length >= 8) score++
  if (/[A-Z]/.test(value)) score++
  if (/[a-z]/.test(value)) score++
  if (/[0-9]/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++

  return score
})

const passwordStrengthLabel = computed(() => {
  if (!values.password) return 'Enter a password'
  if (passwordScore.value <= 2) return 'Weak'
  if (passwordScore.value === 3 || passwordScore.value === 4) return 'Medium'
  return 'Strong'
})

const passwordStrengthPercent = computed(() => {
  return (passwordScore.value / 5) * 100
})

const passwordStrengthClass = computed(() => {
  if (!values.password) return 'strength-empty'
  if (passwordScore.value <= 2) return 'strength-weak'
  if (passwordScore.value === 3 || passwordScore.value === 4) return 'strength-medium'
  return 'strength-strong'
})

const submit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <div class="field-row">
      <FormInputField name="cnpj" label="CNPJ" placeholder="00.000.000/0000-00" inputmode="numeric" />

      <FormInputField name="companyName" label="Company name" placeholder="Your company LTDA" />
    </div>

    <FormInputField name="fullName" label="Your full name" placeholder="Name of responsible person" />

    <div class="field">
      <label class="inline-label">Crypto currencies to operate</label>
      <div class="chips">
        <CryptoChip v-for="c in cryptoCurrencies" :key="c.alias" :currency-model="c"
          :is-active="values.cryptoCurrencies?.includes(c.currency)" @clicked="toggleCrypto" />

      </div>
      <p v-if="cryptoMeta.touched && cryptoError" class="error">{{ cryptoError }}</p>
    </div>

    <div class="field-row">
      <FormInputField name="phone" label="Phone" type="tel" placeholder="+55 11 99999-9999" inputmode="tel" />

      <FormInputField name="email" label="Email" type="email" placeholder="you@company.com" autocomplete="email" />
    </div>

    <FormInputField name="password" label="Password" type="password" autocomplete="new-password"
      placeholder="Create a strong password">
      <template #below>
        <div class="password-strength">
          <div class="password-strength-bar">
            <div class="password-strength-bar-fill" :class="passwordStrengthClass"
              :style="{ width: passwordStrengthPercent + '%' }" />
          </div>
          <span class="password-strength-label">{{ passwordStrengthLabel }}</span>
        </div>

        <ul class="password-hints">
          <li>At least 8 characters</li>
          <li>Use upper and lower case letters</li>
          <li>Include numbers and a symbol</li>
        </ul>
      </template>
    </FormInputField>

    <FormInputField name="passwordConfirmation" label="Confirm password" type="password" autocomplete="new-password"
      placeholder="Repeat your password" />

    <button class="submit" type="submit" :disabled="!meta.valid">
      {{ props.submitLabel }}
    </button>

    <p v-if="props.hintText" class="hint">
      {{ props.hintText }}
    </p>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-row>* {
  flex: 1 1 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.inline-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-main);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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

.password-hints li+li {
  margin-top: 0.1rem;
}

.error {
  font-size: 0.75rem;
  color: var(--color-error);
}

.submit {
  margin-top: 0.5rem;
  border-radius: 999px;
  border: none;
  padding: 0.85rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: var(--color-white);
  box-shadow: var(--shadow-button-primary);
  transition:
    transform 0.08s ease,
    box-shadow 0.08s ease,
    opacity 0.15s ease;
  width: 100%;
}

.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.submit:not(:disabled):active {
  transform: translateY(1px);
  box-shadow: var(--shadow-button-primary-active);
}

.hint {
  margin-top: 0.6rem;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  text-align: center;
}

@media (min-width: 720px) {
  .field-row {
    flex-direction: row;
  }
}
</style>
