<script setup lang="ts">
import { useTranslation } from '@/composables/i18n/useTranslation'

const { t } = useTranslation()
</script>

<template>
  <div class="partner-list-header" role="row" aria-hidden="true">
    <span class="col-name text-uppercase small fw-semibold text-muted">
      {{ t('partner.fullName') }}
    </span>
    <span class="col-cpf text-uppercase small fw-semibold text-muted">
      {{ t('partner.cpf') }}
    </span>
    <span class="col-shares text-uppercase small fw-semibold text-muted text-end">
      {{ t('partner.shares') }}
    </span>
  </div>
</template>

<style scoped>
.partner-list-header {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.5fr) 5rem;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-md);
  border-bottom: 1px solid var(--color-surface-border);
  margin-bottom: var(--spacing-xs);
  letter-spacing: 0.04em;
}
</style>
