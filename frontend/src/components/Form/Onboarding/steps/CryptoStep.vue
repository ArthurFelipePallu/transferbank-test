<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import CryptoChip from '@/components/Form/CryptoChip.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import { onboardingCryptoSchema, type OnboardingCryptoValues } from '@/domain/onboarding/onboarding.schema'
import { CryptoCurrencyEnum } from '@/api/backendApi'
import { useCryptoCurrencies } from '@/composables/useCryptoCurrencies'
import { useTranslation } from '@/composables/useTranslation'

interface Props {
  initialValues?: Partial<OnboardingCryptoValues>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  next: [values: OnboardingCryptoValues]
  back: []
  update: [values: Partial<OnboardingCryptoValues>]
}>()

const { t } = useTranslation()
const { currencies, loadCurrencies } = useCryptoCurrencies()

const { handleSubmit, meta } = useForm<OnboardingCryptoValues>({
  validationSchema: onboardingCryptoSchema,
  initialValues: { cryptoCurrencies: props.initialValues?.cryptoCurrencies ?? [] },
  validateOnMount: false,
})

const {
  value: selectedCurrencies,
  errorMessage: cryptoError,
  meta: cryptoMeta,
  setTouched,
} = useField<CryptoCurrencyEnum[]>('cryptoCurrencies')

onMounted(loadCurrencies)

const toggle = (currency: CryptoCurrencyEnum) => {
  setTouched(true)
  const current = selectedCurrencies.value ?? []
  selectedCurrencies.value = current.includes(currency)
    ? current.filter((c) => c !== currency)
    : [...current, currency]
}

// Persist selection to store as user toggles
watch(selectedCurrencies, (v) => emit('update', { cryptoCurrencies: v ?? [] }))

const submit = handleSubmit((vals) => emit('next', vals))
</script>

<template>
  <form @submit.prevent="submit" novalidate>
    <FormStepHeader
      :title="t('onboarding.steps.crypto.title')"
      :description="t('onboarding.steps.crypto.description')"
    />

    <div class="mb-3">
      <label class="form-label">{{ t('onboarding.cryptoCurrencies') }}</label>
      <div class="d-flex flex-wrap gap-2">
        <CryptoChip
          v-for="c in currencies"
          :key="c.alias"
          :currency-model="c"
          :is-active="(selectedCurrencies ?? []).includes(c.currency)"
          @clicked="toggle"
        />
      </div>
      <div v-if="cryptoMeta.touched && cryptoError" class="invalid-feedback d-block mt-1">
        {{ cryptoError }}
      </div>
    </div>

    <FormNavigation
      :show-back="true"
      :next-disabled="!meta.valid"
      @back="$emit('back')"
      @next="submit"
    />
  </form>
</template>
