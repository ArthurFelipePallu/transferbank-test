<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import InfoTooltip from '@/components/UI/InfoTooltip.vue'
import { CurrencyCode } from '@/domain/pricing/entities/Currency'

interface Props {
  selectedCurrency: CurrencyCode
  iconSize?: number
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: 16,
  position: 'top'
})

const { t } = useTranslation()

const getCurrencyLabel = (source: CurrencyCode): string => {
  switch (source) {
    case CurrencyCode.USD: return '$100 USD'
    case CurrencyCode.BTC: return '0.00153 BTC'
    case CurrencyCode.ETH: return '0.521 ETH'
  }
}

const currencyLabel = getCurrencyLabel(props.selectedCurrency)
</script>

<template>
  <InfoTooltip 
    :icon-size="iconSize" 
    :position="position" 
    aria-label="Account setup cost information"
  >
    <p class="tooltip-item">
      <strong>{{ t('pricing.basedOn') }}:</strong> {{ currencyLabel }}
    </p>
    <p class="tooltip-item">
      <strong>{{ t('pricing.fees') }}:</strong> {{ t('pricing.feesDetail') }}
    </p>
    <p class="tooltip-item mb-0">
      <strong>{{ t('pricing.updates') }}:</strong> {{ t('pricing.updatesDetail') }}
    </p>
  </InfoTooltip>
</template>

<style scoped>
.tooltip-item {
  font-size: 0.8125rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  color: var(--color-text-main);
}

.tooltip-item strong {
  color: var(--color-primary-teal);
  font-weight: 600;
}
</style>
