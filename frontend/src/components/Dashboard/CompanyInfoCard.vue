<script setup lang="ts">
import { useTranslation } from '@/composables/i18n/useTranslation'
import InfoItem from './InfoItem.vue'

export interface CompanyInfo {
  name: string
  email: string
  status: string
}

defineProps<{
  title: string
  info: CompanyInfo
}>()

const { t } = useTranslation()
</script>

<template>
  <section class="card mb-4">
    <div class="card-body p-3 p-md-4">
      <h2 class="h4 fw-semibold mb-3">{{ title }}</h2>

      <div class="company-info-grid">
        <InfoItem
          :label="t('company.companyName')"
          :value="info.name || 'N/A'"
        />
        <InfoItem
          :label="t('company.email')"
          :value="info.email || 'N/A'"
        />
        <InfoItem
          :label="t('dashboard.status')"
          :value="info.status"
          variant="success"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.company-info-grid {
  display: grid;
  gap: var(--spacing-sm);

  /* Below 400px: single column */
  grid-template-columns: 1fr;
}

/* 400px+: 2 per row */
@media (min-width: 400px) {
  .company-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* lg+: 3 per row */
@media (min-width: 992px) {
  .company-info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
