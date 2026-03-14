<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useField } from 'vee-validate'
import CryptoChip from '../CryptoChip.vue'
import { CryptoCurrencyEnum } from '@/api/backendApi'
import { httpCurrencyGateway } from '@/infrastructure/onboarding/HttpCurrencyGateway'
import { loadAllCryptoCurrenciesOrdered } from '@/application/onboarding/cryptoCurrencyUseCase'
import type { CryptoCurrencyOption } from '@/domain/onboarding/interfaces/currencyInterface'
import type { OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'
import { useTranslation } from '@/composables/useTranslation'

interface Props {
  selectedCurrencies: CryptoCurrencyEnum[]
}

defineProps<Props>()

const emit = defineEmits<{
  'toggle': [currency: CryptoCurrencyEnum]
}>()

const { t } = useTranslation()
const cryptoCurrencies = ref<CryptoCurrencyOption[]>([])

const {
  errorMessage: cryptoError,
  meta: cryptoMeta,
  setTouched: setCryptoTouched,
} = useField<OnboardingFormValues['cryptoCurrencies']>('cryptoCurrencies')

onMounted(async () => {
  cryptoCurrencies.value = await loadAllCryptoCurrenciesOrdered(httpCurrencyGateway)
})

const handleToggle = (currency: CryptoCurrencyEnum) => {
  setCryptoTouched(true)
  emit('toggle', currency)
}
</script>

<template>
  <div class="mb-3">
    <label class="form-label">{{ t('onboarding.cryptoCurrencies') }}</label>
    <div class="d-flex flex-wrap gap-2">
      <CryptoChip 
        v-for="c in cryptoCurrencies" 
        :key="c.alias" 
        :currency-model="c"
        :is-active="selectedCurrencies?.includes(c.currency)" 
        @clicked="handleToggle" 
      />
    </div>
    <div v-if="cryptoMeta.touched && cryptoError" class="invalid-feedback d-block">
      {{ cryptoError }}
    </div>
  </div>
</template>

<style scoped>
/* No additional styles needed - using Bootstrap classes */
</style>
