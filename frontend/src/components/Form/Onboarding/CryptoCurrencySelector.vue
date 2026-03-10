<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useField } from 'vee-validate'
import CryptoChip from '../CryptoChip.vue'
import { CryptoCurrencyEnum } from '@/api/backendApi'
import { httpCurrencyGateway } from '@/infrastructure/onboarding/HttpCurrencyGateway'
import { loadCurrenciesWithHighlight } from '@/application/onboarding/cryptoCurrencyUseCase'
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
  cryptoCurrencies.value = await loadCurrenciesWithHighlight(httpCurrencyGateway)
})

const handleToggle = (currency: CryptoCurrencyEnum) => {
  setCryptoTouched(true)
  emit('toggle', currency)
}
</script>

<template>
  <div class="crypto-selector">
    <label class="inline-label">{{ t('onboardingForm.cryptoCurrencies') }}</label>
    <div class="chips">
      <CryptoChip 
        v-for="c in cryptoCurrencies" 
        :key="c.alias" 
        :currency-model="c"
        :is-active="selectedCurrencies?.includes(c.currency)" 
        @clicked="handleToggle" 
      />
    </div>
    <p v-if="cryptoMeta.touched && cryptoError" class="error">{{ cryptoError }}</p>
  </div>
</template>

<style scoped>
.crypto-selector {
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

.error {
  font-size: 0.75rem;
  color: var(--color-error);
}
</style>
