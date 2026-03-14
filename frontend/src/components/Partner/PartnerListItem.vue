<script setup lang="ts">
import type { PartnerSummary } from '@/domain/partner/entities/PartnerSummary'
import { applyCpfMask } from '@/utils/formatters'

defineProps<{
  partner: PartnerSummary
}>()
</script>

<template>
  <div class="card border partner-item">
    <div class="card-body d-flex justify-content-between align-items-center p-3">
      <div class="flex-grow-1 min-w-0">
        <h4 class="h6 fw-semibold mb-1 text-truncate">{{ partner.fullName }}</h4>
        <p class="small text-muted mb-0" style="font-family: 'Courier New', monospace;">
          CPF: {{ applyCpfMask(partner.cpf) }}
        </p>
      </div>
      <div class="d-flex flex-column align-items-end flex-shrink-0 ms-3">
        <span class="h5 fw-bold mb-0 text-primary">{{ partner.shareholding.toFixed(2) }}%</span>
        <span class="small text-uppercase text-muted" style="letter-spacing: 0.5px;">Shares</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.partner-item {
  transition: all 0.2s ease;
}

.partner-item:hover {
  border-color: var(--color-primary-teal) !important;
  transform: translateX(4px);
}

.text-primary {
  color: var(--color-primary-teal) !important;
}
</style>
