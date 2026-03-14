<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useCurrencyStore } from '@/stores/useCurrencyStore'
import { CurrencyDisplayService } from '@/application/currency/CurrencyDisplayService'
import CurrencyPanelHeader from '@/components/Currency/CurrencyPanelHeader.vue'
import CurrencyRateCard from '@/components/Currency/CurrencyRateCard.vue'
import CurrencyInfoGrid from '@/components/Currency/CurrencyInfoGrid.vue'
import MarketStatusBadge from '@/components/Currency/MarketStatusBadge.vue'
import CurrencyPanelFooter from '@/components/Currency/CurrencyPanelFooter.vue'
import ErrorState from '@/components/UI/ErrorState.vue'

// Use centralized currency store
const currencyStore = useCurrencyStore()

// Get centralized currency display configuration
const currencyDisplays = CurrencyDisplayService.getDisplayCurrencies()

onMounted(() => {
  // Start auto-updating rates when component mounts
  currencyStore.startAutoUpdate()
})

onUnmounted(() => {
  // Stop auto-updating when component unmounts
  currencyStore.stopAutoUpdate()
})
</script>

<template>
  <div class="currency-info-panel h-100 d-flex flex-column">
    <!-- Header -->
    <CurrencyPanelHeader 
      title="Market Information"
      subtitle="Real-time currency rates"
      icon-name="TrendingUp"
    />

    <!-- Content -->
    <div class="panel-content flex-grow-1 p-4">
      <!-- Error State -->
      <ErrorState 
        v-if="currencyStore.error" 
        :message="currencyStore.error"
      />

      <!-- Currency Information -->
      <div v-else class="currencies-container">
        <!-- Currency Cards Grid -->
        <div class="currency-grid">
          <CurrencyRateCard 
            v-for="display in currencyDisplays"
            :key="display.code"
            :icon-name="display.iconName"
            :symbol="display.symbol"
            :currency-code="display.code"
            :currency-name="display.name"
            :current-rate="currencyStore.formatRate(display.code)"
            :current-value="currencyStore.getDisplayValues(display.code).currentValue"
            :previous-value="currencyStore.getDisplayValues(display.code).previousValue"
          />
        </div>

        <!-- Market Status -->
        <MarketStatusBadge 
          :is-active="true"
          status-text="Market Active"
          description="Real-time data from CoinGecko API"
        />
      </div>
    </div>

    <!-- Footer -->
    <CurrencyPanelFooter message="Rates update automatically" />
  </div>
</template>

<style scoped>
.currency-info-panel {
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  color: var(--color-white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.panel-content {
  background: rgba(255, 255, 255, 0.03);
}

.currencies-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.currency-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .currency-info-panel {
    margin-top: 1rem;
  }
}
</style>
