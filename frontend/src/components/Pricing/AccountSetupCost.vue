<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { usePricingStore } from '@/stores/usePricingStore'
import { useTranslation } from '@/composables/useTranslation'
import PriceChangeIndicator from '@/components/Pricing/PriceChangeIndicator.vue'
import AccountSetupCostInfo from '@/components/Pricing/AccountSetupCostInfo.vue'

const pricingStore = usePricingStore()
const { t } = useTranslation()

onMounted(() => {
  // Start auto-updating price when component mounts
  pricingStore.startAutoUpdate()
})

onUnmounted(() => {
  // Stop auto-updating when component unmounts
  pricingStore.stopAutoUpdate()
})
</script>

<template>
  <div class="account-cost-compact">
    <div v-if="pricingStore.isCalculating" class="cost-loading">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">{{ t('common.loading') }}</span>
      </div>
      <span class="ms-2 small">{{ t('pricing.loadingPrice') }}</span>
    </div>

    <div v-else-if="pricingStore.error" class="cost-error">
      <span class="text-danger small">{{ pricingStore.error }}</span>
    </div>

    <div v-else-if="pricingStore.hasPrice" class="cost-display">
      <span class="cost-label">{{ t('pricing.accountSetupCost') }}</span>
      
      <div class="cost-value-wrapper">
        <Transition name="fade" mode="out-in">
          <div :key="pricingStore.currentPrice" class="cost-value">
            {{ pricingStore.formatPrice() }}
          </div>
        </Transition>
        
        <PriceChangeIndicator 
          :current-value="pricingStore.displayValues.currentValue" 
          :previous-value="pricingStore.displayValues.previousValue" 
          size="md" 
        />
      </div>
      
      <AccountSetupCostInfo 
        :selected-currency="pricingStore.selectedCurrency!"
        :icon-size="16"
        position="top"
      />
    </div>
  </div>
</template>

<style scoped>
.account-cost-compact {
  background: linear-gradient(135deg, var(--color-teal-alpha-5), var(--color-accent-teal-alpha-5));
  border: 1px solid var(--color-teal-alpha-20);
  border-radius: 0.5rem;
  padding: 0.875rem 1rem;
  margin-bottom: 1.5rem;
  /* Full width on mobile */
  width: 100%;
}

/* Tablet and up: auto width (fit content) */
@media (min-width: 640px) {
  .account-cost-compact {
    width: auto;
    display: inline-block;
  }
}

.cost-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.cost-error {
  text-align: center;
}

.cost-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cost-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-main);
  white-space: nowrap;
}

.cost-value-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cost-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-teal);
  white-space: nowrap;
}

/* Vue transition for smooth value changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Tablet and up */
@media (min-width: 768px) {
  .account-cost-compact {
    padding: 1rem 1.25rem;
  }

  .cost-label {
    font-size: 1rem;
  }

  .cost-value {
    font-size: 1.75rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .cost-value {
    font-size: 2rem;
  }
}

/* Mobile: Stack vertically if needed */
@media (max-width: 480px) {
  .cost-display {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .cost-label {
    width: 100%;
  }

  .cost-value {
    font-size: 1.75rem;
  }
}
</style>
