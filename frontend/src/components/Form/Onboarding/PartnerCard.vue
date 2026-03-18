<script setup lang="ts">
import { Users, Trash2 } from 'lucide-vue-next'
import type { OnboardingPartner } from '@/domain/onboarding/onboarding.types'
import { formatCpfDisplay } from '@/utils/formatters'

defineProps<{ partner: OnboardingPartner }>()
const emit = defineEmits<{ remove: [tempId: string] }>()
</script>

<template>
  <div class="partner-card">
    <div class="partner-avatar">
      <Users :size="14" />
    </div>
    <div class="partner-info">
      <p class="partner-name">{{ partner.fullName }}</p>
      <p class="partner-cpf">{{ formatCpfDisplay(partner.cpf) }}</p>
    </div>
    <div class="partner-actions">
      <span class="partner-share">{{ partner.shareholding.toFixed(2) }}%</span>
      <button
        type="button"
        class="btn btn-sm btn-outline-danger p-1"
        @click="emit('remove', partner.tempId)"
        :aria-label="`Remove ${partner.fullName}`"
      >
        <Trash2 :size="13" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.partner-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--border-radius-md);
  background: var(--bs-body-bg);
  transition: border-color 0.2s ease;
  min-width: 0;
  overflow: hidden;
}
.partner-card:hover { border-color: var(--color-primary-teal); }

.partner-avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--color-primary-teal);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.partner-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.partner-name {
  font-size: 0.82rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.partner-cpf {
  font-size: 0.7rem;
  color: var(--bs-secondary-color);
  margin: 0;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.partner-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}
.partner-share {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary-teal);
  white-space: nowrap;
}
</style>
