<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import type { IconName } from '@/utils/LucideIconMap'

defineProps<{
  title: string
  description: string
  variant?: 'default' | 'primary'
  icon?: IconName
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="action-card"
    :class="variant === 'primary' ? 'action-card--primary' : 'action-card--default'"
    type="button"
    @click="emit('click')"
  >
    <!-- Icon -->
    <span v-if="icon" class="action-card__icon-wrap" aria-hidden="true">
      <BaseLucideIcon :name="icon" :size="20" class="action-card__icon" />
    </span>

    <!-- Text -->
    <span class="action-card__body">
      <span class="action-card__title">{{ title }}</span>
      <span class="action-card__desc">{{ description }}</span>
    </span>

    <!-- Arrow -->
    <BaseLucideIcon name="ArrowRight" :size="18" class="action-card__arrow flex-shrink-0" />
  </button>
</template>

<style scoped>
/* ── Shared base ── */
.action-card {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-surface-border);
  text-align: left;
  cursor: pointer;
  font-family: inherit;

  /* CSS custom props drive all color transitions — one place to change */
  --card-bg:       transparent;
  --card-text:     var(--color-text-main);
  --card-desc:     var(--color-text-muted);
  --card-icon-bg:  var(--color-teal-alpha-10);
  --card-icon-clr: var(--color-primary-teal);
  --card-arrow:    var(--color-primary-teal);
  --card-border:   var(--color-surface-border);

  background: var(--card-bg);
  color: var(--card-text);
  border-color: var(--card-border);

  /* All color transitions run together */
  transition:
    color 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.2s ease;
}

/* Fill overlay — slides in from left on hover */
.action-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-primary-teal);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  border-radius: inherit;
}

/* All children sit above the fill overlay */
.action-card > * {
  position: relative;
  z-index: 1;
}

/* ── Default variant (white bg → teal fill) ── */
.action-card--default {
  background: var(--color-white);
}

.action-card--default:hover {
  border-color: var(--color-primary-teal);
  box-shadow: 0 4px 16px var(--color-teal-alpha-20);
  color: var(--color-white);
}

.action-card--default:hover::before {
  transform: scaleX(1);
}

.action-card--default:hover .action-card__desc {
  color: var(--color-white-alpha-80);
}

.action-card--default:hover .action-card__icon-wrap {
  background: var(--color-white-alpha-20);
}

.action-card--default:hover .action-card__icon,
.action-card--default:hover .action-card__arrow {
  color: var(--color-white);
}

/* ── Primary variant (teal bg → white fill) ── */
.action-card--primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border-color: transparent;
  color: var(--color-white);
}

.action-card--primary .action-card__desc {
  color: var(--color-white-alpha-80);
}

.action-card--primary .action-card__icon-wrap {
  background: var(--color-white-alpha-20);
}

.action-card--primary .action-card__icon,
.action-card--primary .action-card__arrow {
  color: var(--color-white);
}

.action-card--primary::before {
  background: var(--color-white);
}

.action-card--primary:hover {
  box-shadow: 0 4px 16px var(--color-teal-alpha-30);
  color: var(--color-primary-teal);
}

.action-card--primary:hover::before {
  transform: scaleX(1);
}

.action-card--primary:hover .action-card__desc {
  color: var(--color-text-muted);
}

.action-card--primary:hover .action-card__icon-wrap {
  background: var(--color-teal-alpha-10);
}

.action-card--primary:hover .action-card__icon,
.action-card--primary:hover .action-card__arrow {
  color: var(--color-primary-teal);
}

/* ── Sub-elements ── */
.action-card__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--border-radius-md);
  background: var(--color-teal-alpha-10);
  flex-shrink: 0;
  transition: background 0.35s ease;
}

.action-card__icon {
  color: var(--color-primary-teal);
  transition: color 0.35s ease;
}

.action-card__body {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 0;
  gap: 0.125rem;
}

.action-card__title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  line-height: var(--line-height-tight);
  transition: color 0.35s ease;
}

.action-card__desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  line-height: var(--line-height-normal);
  transition: color 0.35s ease;
}

.action-card__arrow {
  color: var(--color-primary-teal);
  transition: color 0.35s ease, transform 0.2s ease;
}

.action-card:hover .action-card__arrow {
  transform: translateX(4px);
}
</style>
