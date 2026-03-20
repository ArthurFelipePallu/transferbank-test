<script setup lang="ts">
import type { PartnerSummary } from '@/domain/partner/entities/PartnerSummary'
import { formatCpfDisplay } from '@/utils/formatters'
import { useTranslation } from '@/composables/i18n/useTranslation'

defineProps<{
  partner: PartnerSummary
}>()

const { t } = useTranslation()
</script>

<template>
  <div class="partner-list-item">
    <!--
      Desktop / tablet (≥500px): flat grid row — no labels, aligns with PartnerListHeader
      Mobile (<500px): card layout — labels shown inline, name truncated
    -->

    <!-- Grid row (≥500px) -->
    <span class="col-name fw-semibold text-truncate">{{ partner.fullName }}</span>
    <span class="col-cpf text-muted font-monospace small text-truncate">{{ formatCpfDisplay(partner.cpf) }}</span>
    <span class="col-shares fw-bold text-end">{{ partner.shareholding.toFixed(2) }}%</span>

    <!-- Card layout (<500px) — shown via CSS, hidden on larger screens -->
    <div class="mobile-card">
      <div class="mobile-card__main">
        <p class="fw-semibold small mb-0 text-truncate">{{ partner.fullName }}</p>
        <p class="text-muted font-monospace mb-0 mobile-card__cpf">
          {{ t('partner.cpf') }}: {{ formatCpfDisplay(partner.cpf) }}
        </p>
      </div>
      <div class="mobile-card__shares">
        <span class="fw-bold">{{ partner.shareholding.toFixed(2) }}%</span>
        <span class="text-uppercase text-muted mobile-card__shares-label">
          {{ t('partner.shares') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Base: grid row layout (≥500px) ── */
.partner-list-item {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.5fr) 5rem;
  grid-template-rows: auto;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--border-radius-md);
  background: var(--color-white);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  min-width: 0;
}

.partner-list-item:hover {
  border-color: var(--color-primary-teal);
  box-shadow: 0 0 0 2px var(--color-teal-alpha-10);
  transform: translateX(3px);
}

/* Grid columns — visible on ≥500px */
.col-name,
.col-cpf,
.col-shares {
  min-width: 0;
  display: block;
}

.col-shares {
  color: var(--color-primary-teal);
}

/* Mobile card — hidden on ≥500px */
.mobile-card {
  display: none;
}

/* ── Mobile: card layout (<500px) ── */
@media (max-width: 499px) {
  .partner-list-item {
    display: block; /* collapse grid */
    padding: var(--spacing-sm) var(--spacing-md);
  }

  /* Hide grid columns */
  .col-name,
  .col-cpf,
  .col-shares {
    display: none;
  }

  /* Show card layout */
  .mobile-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
    min-width: 0;
  }

  .mobile-card__main {
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
  }

  .mobile-card__shares {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
    color: var(--color-primary-teal);
  }

  .mobile-card__cpf {
    font-size: var(--font-size-xs);
  }

  .mobile-card__shares-label {
    font-size: var(--font-size-xs);
    letter-spacing: 0.05em;
  }
}
</style>
