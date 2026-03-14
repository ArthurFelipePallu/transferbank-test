<script setup lang="ts">
import PriceChangeIndicator from '@/components/Pricing/PriceChangeIndicator.vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import type { IconName } from '@/utils/LucideIconMap'

defineProps<{
  iconName?: IconName
  symbol: string
  currencyCode: string
  currencyName: string
  currentRate: string
  currentValue: number | null
  previousValue: number | null
}>()
</script>

<template>
  <div class="currency-rate-card">
    <!-- Currency Header with Icon or Symbol -->
    <div class="currency-header">
      <div class="currency-icon-wrapper">
        <BaseLucideIcon 
          v-if="iconName" 
          :name="iconName" 
          :size="20" 
          color="var(--color-white)" 
        />
        <span v-else class="currency-symbol-text">{{ symbol }}</span>
      </div>
      <div class="currency-info">
        <span class="currency-code">{{ currencyCode }}</span>
        <span class="currency-name">{{ currencyName }}</span>
      </div>
    </div>

    <!-- Rate Display -->
    <div class="rate-value">{{ currentRate }}</div>

    <!-- Price Change -->
    <div class="rate-change">
      <PriceChangeIndicator 
        :current-value="currentValue" 
        :previous-value="previousValue" 
        size="sm" 
      />
    </div>
  </div>
</template>

<style scoped>
.currency-rate-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.875rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.2s ease;
}

.currency-rate-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.currency-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 140px;
}

.currency-icon-wrapper {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.currency-symbol-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-white);
}

.currency-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.currency-code {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
}

.currency-name {
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1;
}

.rate-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-white);
  line-height: 1.2;
  flex: 1;
}

.rate-change {
  display: flex;
  align-items: center;
  min-height: 24px;
  margin-left: auto;
}

/* Responsive adjustments */
@media (max-width: 991px) {
  .currency-rate-card {
    padding: 0.75rem 1rem;
    gap: 1rem;
  }
  
  .rate-value {
    font-size: 1.125rem;
  }
}

@media (max-width: 767px) {
  .currency-rate-card {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .currency-header {
    min-width: auto;
  }
  
  .rate-value {
    font-size: 1rem;
  }
  
  .rate-change {
    margin-left: 0;
  }
}
</style>
