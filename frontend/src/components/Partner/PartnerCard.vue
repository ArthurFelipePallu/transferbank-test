<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import type { OnboardingPartner } from '@/domain/onboarding/onboarding.types'
import { formatCpfDisplay } from '@/utils/formatters'
import { useTranslation } from '@/composables/i18n/useTranslation'

defineProps<{ partner: OnboardingPartner }>()
const emit = defineEmits<{
  remove: [tempId: string]
  edit: [tempId: string]
}>()

const { t } = useTranslation()
</script>

<template>
  <div class="partner-card d-flex align-items-center gap-2 px-3 py-2 border rounded-3 bg-body overflow-hidden">
    <!-- Avatar -->
    <div class="avatar-circle avatar-circle--sm partner-avatar flex-shrink-0">
      <BaseLucideIcon name="Users" :size="14" />
    </div>

    <!-- Info -->
    <div class="flex-grow-1 min-w-0 overflow-hidden">
      <p class="fw-semibold small mb-0 text-truncate">{{ partner.fullName }}</p>
      <p class="text-secondary mb-0 font-monospace text-truncate partner-cpf">
        {{ formatCpfDisplay(partner.cpf) }}
      </p>
    </div>

    <!-- Actions -->
    <div class="d-flex align-items-center gap-1 flex-shrink-0">
      <span class="fw-bold small text-nowrap partner-share">
        {{ partner.shareholding.toFixed(2) }}%
      </span>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary p-1"
        @click="emit('edit', partner.tempId)"
        :aria-label="t('onboarding.partnersStep.editPartner', { name: partner.fullName })"
      >
        <BaseLucideIcon name="Pencil" :size="13" />
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-danger p-1"
        @click="emit('remove', partner.tempId)"
        :aria-label="t('onboarding.partnersStep.removePartner', { name: partner.fullName })"
      >
        <BaseLucideIcon name="Trash2" :size="13" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.partner-card {
  transition: border-color 0.2s ease;
}
.partner-card:hover {
  border-color: var(--color-primary-teal) !important;
}

.partner-avatar {
  background: var(--color-primary-teal);
  color: var(--color-white);
  width: 1.75rem;
  height: 1.75rem;
}

.partner-cpf {
  font-size: var(--font-size-xs);
}

.partner-share {
  color: var(--color-primary-teal);
}
</style>
