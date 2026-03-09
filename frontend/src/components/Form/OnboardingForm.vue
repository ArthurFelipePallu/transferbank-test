<script setup lang="ts">
import CryptoChip from './CryptoChip.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import FormInputField from './FormInputField.vue'
import { CryptoCurrencyEnum } from '@/api/backendApi'
import { httpCurrencyGateway } from '@/infrastructure/onboarding/HttpCurrencyGateway'
import { loadCurrenciesWithHighlight } from '@/application/onboarding/cryptoCurrencyUseCase'
import type { CryptoCurrencyOption } from '@/domain/onboarding/interfaces/currencyInterface'
import { onboardingSchema, type OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useCnpjLookup } from '@/composables/useCnpjLookup'
import { useCepLookup } from '@/composables/useCepLookup'
import { sanitizeCnpj, sanitizeCep, formatPhone, formatCep } from '@/utils/formatters'
import { useUiStore } from '@/stores/useUiStore'
import { useTranslation } from '@/composables/useTranslation'

const cryptoCurrencies = ref<CryptoCurrencyOption[]>([])
const onboardingStore = useOnboardingStore()
const uiStore = useUiStore()
const { t } = useTranslation()
const { isLoading: isCnpjLoading, statusError, lookup: lookupCnpj, reset: resetCnpjLookup } = useCnpjLookup()
const { isLoading: isCepLoading, lookup: lookupCep, reset: resetCepLookup } = useCepLookup()
const cnpjStatusError = ref<string | null>(null)

onMounted(async () => {
  cryptoCurrencies.value = await loadCurrenciesWithHighlight(httpCurrencyGateway)
  
  // Restore cached form data if available
  if (onboardingStore.companyData.cnpj || onboardingStore.companyData.email) {
    setValues({
      cnpj: onboardingStore.companyData.cnpj || '',
      companyName: onboardingStore.companyData.companyName || '',
      fantasyName: onboardingStore.companyData.fantasyName || '',
      cryptoCurrencies: onboardingStore.companyData.cryptoCurrencies || [],
      phone: onboardingStore.companyData.phone || '',
      email: onboardingStore.companyData.email || '',
      cep: onboardingStore.companyData.cep || '',
      logradouro: onboardingStore.companyData.logradouro || '',
      numero: onboardingStore.companyData.numero || '',
      complemento: onboardingStore.companyData.complemento || '',
      bairro: onboardingStore.companyData.bairro || '',
      cidade: onboardingStore.companyData.cidade || '',
      uf: onboardingStore.companyData.uf || '',
      password: '',
      passwordConfirmation: '',
    })
  }
})

const props = withDefaults(
  defineProps<{
    submitLabel?: string
    hintText?: string
  }>(),
  {
    submitLabel: undefined,
    hintText: undefined,
  },
)

const emit = defineEmits<{
  submit: [values: OnboardingFormValues]
}>()

const { handleSubmit, meta, values, setFieldValue, setValues } = useForm<OnboardingFormValues>({
  validationSchema: onboardingSchema,
  initialValues: {
    cnpj: '',
    companyName: '',
    fantasyName: '',
    cryptoCurrencies: [],
    phone: '',
    email: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    password: '',
    passwordConfirmation: '',
  },
  validateOnMount: false,
})

// Watch form values and sync to store for caching
watch(values, (newValues) => {
  onboardingStore.updateCompanyData({
    cnpj: newValues.cnpj,
    companyName: newValues.companyName,
    fantasyName: newValues.fantasyName,
    cryptoCurrencies: newValues.cryptoCurrencies,
    phone: newValues.phone,
    email: newValues.email,
    cep: newValues.cep,
    logradouro: newValues.logradouro,
    numero: newValues.numero,
    complemento: newValues.complemento,
    bairro: newValues.bairro,
    cidade: newValues.cidade,
    uf: newValues.uf,
  })
}, { deep: true })

// Watch CNPJ field and auto-fill form when valid CNPJ is entered
watch(() => values.cnpj, async (newCnpj, oldCnpj) => {
  const sanitized = sanitizeCnpj(newCnpj)
  const oldSanitized = sanitizeCnpj(oldCnpj || '')
  
  // Reset status error when CNPJ changes
  cnpjStatusError.value = null
  resetCnpjLookup()
  
  // Only lookup if CNPJ has 14 digits and actually changed
  if (sanitized.length === 14 && sanitized !== oldSanitized) {
    const companyInfo = await lookupCnpj(sanitized)
    
    // Check for status error
    if (statusError.value) {
      cnpjStatusError.value = statusError.value.message
      uiStore.showError(statusError.value.message, 8000)
      return
    }
    
    if (companyInfo) {
      // Auto-fill form with retrieved data (only if fields are empty)
      if (!values.companyName) {
        setFieldValue('companyName', companyInfo.razaoSocial || '')
      }
      if (!values.fantasyName) {
        setFieldValue('fantasyName', companyInfo.nomeFantasia || companyInfo.razaoSocial || '')
      }
      if (!values.phone && companyInfo.telefone) {
        setFieldValue('phone', formatPhone(companyInfo.telefone))
      }
      if (!values.email && companyInfo.email) {
        setFieldValue('email', companyInfo.email)
      }
      
      // Auto-fill CEP if available
      if (!values.cep && companyInfo.cep) {
        setFieldValue('cep', formatCep(companyInfo.cep))
      }
    }
  }
})

// Watch CEP field and auto-fill address when valid CEP is entered
watch(() => values.cep, async (newCep, oldCep) => {
  const sanitized = sanitizeCep(newCep)
  const oldSanitized = sanitizeCep(oldCep || '')
  
  // Reset CEP lookup
  resetCepLookup()
  
  // Only lookup if CEP has 8 digits and actually changed
  if (sanitized.length === 8 && sanitized !== oldSanitized) {
    const addressInfo = await lookupCep(sanitized)
    
    if (addressInfo) {
      // Auto-fill address fields (only if empty)
      if (!values.logradouro) {
        setFieldValue('logradouro', addressInfo.logradouro || '')
      }
      if (!values.bairro) {
        setFieldValue('bairro', addressInfo.bairro || '')
      }
      if (!values.cidade) {
        setFieldValue('cidade', addressInfo.localidade || '')
      }
      if (!values.uf) {
        setFieldValue('uf', addressInfo.uf || '')
      }
    }
  }
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
  if (!values.password) return t('onboardingForm.passwordStrength.enterPassword')
  if (passwordScore.value <= 2) return t('onboardingForm.passwordStrength.weak')
  if (passwordScore.value === 3 || passwordScore.value === 4) return t('onboardingForm.passwordStrength.medium')
  return t('onboardingForm.passwordStrength.strong')
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
  // Prevent submission if company status is invalid
  if (cnpjStatusError.value) {
    uiStore.showError('Cannot register an inactive company', 5000)
    return
  }
  
  emit('submit', values)
})
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <div class="field-row">
      <div class="field-with-indicator">
        <FormInputField name="cnpj" :label="t('onboardingForm.cnpj')" placeholder="00.000.000/0000-00" inputmode="numeric" mask="cnpj" />
        <span v-if="isCnpjLoading" class="loading-indicator">{{ t('onboardingForm.searching') }}</span>
      </div>

      <FormInputField name="companyName" :label="t('onboardingForm.companyName')" placeholder="Your company LTDA" />
    </div>
    
    <!-- Company Status Error Alert -->
    <div v-if="cnpjStatusError" class="status-error-alert">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <div class="status-error-content">
        <strong>{{ t('onboardingForm.companyStatusError') }}</strong>
        <p>{{ cnpjStatusError }}</p>
      </div>
    </div>

    <FormInputField name="fantasyName" :label="t('onboardingForm.fantasyName')" placeholder="Company fantasy name" />

    <div class="field">
      <label class="inline-label">{{ t('onboardingForm.cryptoCurrencies') }}</label>
      <div class="chips">
        <CryptoChip v-for="c in cryptoCurrencies" :key="c.alias" :currency-model="c"
          :is-active="values.cryptoCurrencies?.includes(c.currency)" @clicked="toggleCrypto" />

      </div>
      <p v-if="cryptoMeta.touched && cryptoError" class="error">{{ cryptoError }}</p>
    </div>

    <div class="field-row">
      <FormInputField name="phone" :label="t('onboardingForm.phone')" type="tel" placeholder="+55 (11) 99999-9999" inputmode="tel"
        mask="phone" />

      <FormInputField name="email" :label="t('onboardingForm.email')" type="email" placeholder="you@company.com" autocomplete="email" />
    </div>

    <!-- Address Section -->
    <div class="field-row">
      <div class="field-with-indicator">
        <FormInputField name="cep" :label="t('onboardingForm.cep')" placeholder="00000-000" inputmode="numeric" mask="cep" />
        <span v-if="isCepLoading" class="loading-indicator">{{ t('onboardingForm.searching') }}</span>
      </div>
      
      <FormInputField name="logradouro" :label="t('onboardingForm.street')" placeholder="Rua Example" />
    </div>

    <div class="field-row">
      <FormInputField name="numero" :label="t('onboardingForm.number')" placeholder="123" />
      <FormInputField name="complemento" :label="t('onboardingForm.complement')" placeholder="Apt 45 (optional)" />
    </div>

    <div class="field-row">
      <FormInputField name="bairro" :label="t('onboardingForm.neighborhood')" placeholder="Centro" />
      <FormInputField name="cidade" :label="t('onboardingForm.city')" placeholder="São Paulo" />
    </div>

    <FormInputField name="uf" :label="t('onboardingForm.state')" placeholder="SP" maxlength="2" />

    <FormInputField name="password" :label="t('onboardingForm.password')" type="password" autocomplete="new-password"
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
          <li>{{ t('onboardingForm.passwordHints.minLength') }}</li>
          <li>{{ t('onboardingForm.passwordHints.caseLetters') }}</li>
          <li>{{ t('onboardingForm.passwordHints.numbersSymbols') }}</li>
        </ul>
      </template>
    </FormInputField>

    <FormInputField name="passwordConfirmation" :label="t('onboardingForm.confirmPassword')" type="password" autocomplete="new-password"
      placeholder="Repeat your password" :validate-on-input="true" />

    <button class="submit" type="submit" :disabled="!meta.valid || !!cnpjStatusError">
      {{ props.submitLabel || t('onboardingForm.createAccount') }}
    </button>

    <p v-if="props.hintText || t('onboardingForm.hint')" class="hint">
      {{ props.hintText || t('onboardingForm.hint') }}
    </p>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

@media (min-width: 640px) {
  .form {
    gap: 1.25rem;
  }

  .field-row {
    gap: 1.25rem;
  }
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
  border-radius: 0.75rem;
  border: none;
  padding: 1rem 1.2rem;
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
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
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
  line-height: 1.5;
}

@media (min-width: 640px) {
  .field-row {
    flex-direction: row;
  }

  .submit {
    border-radius: 999px;
  }
}

.field-with-indicator {
  position: relative;
  flex: 1;
}

.loading-indicator {
  position: absolute;
  right: 0.75rem;
  top: 2.5rem;
  font-size: 0.75rem;
  color: var(--color-primary-teal);
  font-weight: 500;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-error-alert {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  color: var(--color-error);
  margin-top: -0.5rem;
}

.status-error-alert svg {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.status-error-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-error-content strong {
  font-size: 0.875rem;
  font-weight: 600;
}

.status-error-content p {
  font-size: 0.8125rem;
  margin: 0;
  line-height: 1.5;
}
</style>

