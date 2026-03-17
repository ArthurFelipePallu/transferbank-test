<script setup lang="ts">
import PriceChangeIndicator from '@/components/Pricing/PriceChangeIndicator.vue'

defineProps<{
  currencySymbol: string
  currencyLabel: string
  description: string
  currentRate: string
  currentValue: number | null
  previousValue: number | null
}>()
</script>

<template>
  <div class="currency-card">
    <!-- Currency Name -->
    <div class="mb-3">
      <div class="d-flex align-items-center gap-2 mb-2">
        <span class="currency-symbol">{{ currencySymbol }}</span>
        <h3 class="h6 mb-0 fw-semibold">{{ currencyLabel }}</h3>
      </div>
      <p class="text-muted small mb-0">{{ description }}</p>
    </div>

    <!-- Current Rate -->
    <div class="rate-display mb-3">
      <div class="d-flex align-items-baseline gap-2 mb-2">
        <span class="current-rate">{{ currentRate }}</span>
        <PriceChangeIndicator 
          :current-value="currentValue" 
          :previous-value="previousValue" 
          size="md" 
        />
      </div>
      <p class="text-muted small mb-0">
        Per 1 {{ currencySymbol }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.currency-card {
  background: var(--color-white-alpha-5);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--color-white-alpha-10);
}

.currency-symbol {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-white-alpha-90);
}

.rate-display {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-white-alpha-10);
}

.current-rate {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-white);
  line-height: 1;
}

.text-muted {
  color: var(--color-white-alpha-70) !important;
}

/* Responsive adjustments */
@media (max-width: 991px) {
  .current-rate {
    font-size: 1.75rem;
  }
}

@media (max-width: 767px) {
  .current-rate {
    font-size: 1.5rem;
  }
}
</style>
