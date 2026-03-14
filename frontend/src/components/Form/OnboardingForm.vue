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
import FormValidationFeedback from './Onboarding/FormValidationFeedback.vue'
import AccountSetupCost from '@/components/Pricing/AccountSetupCost.vue'

const onboardingStore = useOnboardingStore()
const uiStore = useUiStore()
const { t } = useTranslation()
const cnpjStatusError = ref<string | null>(null)
const contactInfoRef = ref<InstanceType<typeof ContactInfoSection> | null>(null)

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
    uiStore.showError(t('onboarding.toasts.inactiveCompany'), 5000)
    return
  }
  
  // Get full phone number with dial code
  const fullPhone = contactInfoRef.value?.getFullPhoneNumber() || values.phone
  
  // Submit with full phone number
  emit('submit', {
    ...values,
    phone: fullPhone
  })
})
</script>

<template>
  <form @submit.prevent="submit">
    <div class="mb-3">
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
    </div>

    <StatusErrorAlert v-if="cnpjStatusError" :message="cnpjStatusError" class="mb-3" />

    <div class="mb-3">
      <CryptoCurrencySelector
        :selected-currencies="values.cryptoCurrencies"
        @toggle="toggleCrypto"
      />
    </div>

    <div class="mb-3">
      <ContactInfoSection ref="contactInfoRef" />
    </div>

    <div class="mb-3">
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
    </div>

    <div class="mb-4">
      <PasswordSection :password="values.password" />
    </div>

    <!-- Account Setup Cost -->
    <AccountSetupCost />

    <!-- Validation Feedback -->
    <FormValidationFeedback />

    <div class="d-grid mb-3">
      <button type="submit" class="btn btn-primary btn-lg" :disabled="!meta.valid || !!cnpjStatusError">
        {{ props.submitLabel || t('onboarding.createAccount') }}
      </button>
    </div>

    <p v-if="props.hintText || t('onboarding.hint')" class="text-center text-muted small mb-0">
      {{ props.hintText || t('onboarding.hint') }}
    </p>
  </form>
</template>

<style scoped>
.btn-primary {
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

@media (min-width: 640px) {
  .btn-primary {
    border-radius: 999px;
  }
}
</style>

