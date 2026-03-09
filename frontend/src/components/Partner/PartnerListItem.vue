<script setup lang="ts">
import type { PartnerSummary } from '@/domain/partner/entities/PartnerSummary'
import { applyCpfMask } from '@/utils/formatters'

defineProps<{
  partner: PartnerSummary
}>()
</script>

<template>
  <div class="partner-item">
    <div class="partner-info">
      <h4 class="partner-name">{{ partner.fullName }}</h4>
      <p class="partner-cpf">CPF: {{ applyCpfMask(partner.cpf) }}</p>
    </div>
    <div class="partner-shares">
      <span class="shares-value">{{ partner.shareholding.toFixed(2) }}%</span>
      <span class="shares-label">Shares</span>
    </div>
  </div>
</template>

<style scoped>
.partner-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.partner-item:hover {
  border-color: var(--color-primary-teal);
  transform: translateX(4px);
}

.partner-info {
  flex: 1;
  min-width: 0;
}

.partner-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.partner-cpf {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
  font-family: 'Courier New', monospace;
}

.partner-shares {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
  flex-shrink: 0;
  margin-left: 1rem;
}

.shares-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary-teal);
}

.shares-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Tablet and up */
@media (min-width: 640px) {
  .partner-name {
    font-size: 1.125rem;
  }

  .partner-cpf {
    font-size: 0.9375rem;
  }

  .shares-value {
    font-size: 1.25rem;
  }
}
</style>
