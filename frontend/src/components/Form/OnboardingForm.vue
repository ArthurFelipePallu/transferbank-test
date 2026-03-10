<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { CryptoCurrencyEnum } from '@/api/backendApi'
import { onboardingSchema, type OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useUiStore } from '@/stores/useUiStore'
import { useTranslation } from '@/composables/useTranslation'
import CompanyInfoSection from './Onboarding/CompanyInfoSection.vue'
import StatusErrorAlert from './Onboarding/StatusErrorAlert.vue'
import CryptoCurrencySelector from './Onboarding/CryptoCurrencySelector.vue'
import ContactInfoSection from './Onboarding/ContactInfoSection.vue'
import AddressSection from './Onboarding/AddressSection.vue'
import PasswordSection from './Onboarding/PasswordSection.vue'

const onboardingStore = useOnboardingStore()
const uiStore = useUiStore()
const { t } = useTranslation()
const cnpjStatusError = ref<string | null>(null)

onMounted(() => {
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

const toggleCrypto = (symbol: CryptoCurrencyEnum) => {
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

const handleStatusError = (error: string | null) => {
  cnpjStatusError.value = error
}

const handleCompanyDataUpdate = (field: keyof OnboardingFormValues, value: string) => {
  setFieldValue(field, value)
}

const handleAddressUpdate = (field: keyof OnboardingFormValues, value: string) => {
  setFieldValue(field, value)
}

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
    <CompanyInfoSection
      :cnpj="values.cnpj"
      :company-name="values.companyName"
      :fantasy-name="values.fantasyName"
      @status-error="handleStatusError"
      @update:company-name="(val) => handleCompanyDataUpdate('companyName', val)"
      @update:fantasy-name="(val) => handleCompanyDataUpdate('fantasyName', val)"
      @update:phone="(val) => handleCompanyDataUpdate('phone', val)"
      @update:email="(val) => handleCompanyDataUpdate('email', val)"
      @update:cep="(val) => handleCompanyDataUpdate('cep', val)"
    />

    <StatusErrorAlert v-if="cnpjStatusError" :message="cnpjStatusError" />

    <CryptoCurrencySelector
      :selected-currencies="values.cryptoCurrencies"
      @toggle="toggleCrypto"
    />

    <ContactInfoSection />

    <AddressSection
      :cep="values.cep"
      :logradouro="values.logradouro"
      :bairro="values.bairro"
      :cidade="values.cidade"
      :uf="values.uf"
      @update:logradouro="(val) => handleAddressUpdate('logradouro', val)"
      @update:bairro="(val) => handleAddressUpdate('bairro', val)"
      @update:cidade="(val) => handleAddressUpdate('cidade', val)"
      @update:uf="(val) => handleAddressUpdate('uf', val)"
    />

    <PasswordSection :password="values.password" />

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
  .form {
    gap: 1.25rem;
  }

  .submit {
    border-radius: 999px;
  }
}
</style>

