<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { useRouter } from 'vue-router'
import { RouteName } from '@/domain/navigation/types/RouteNames'
import type { IconName } from '@/utils/LucideIconMap'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

const { t } = useTranslation()
const router = useRouter()

interface Highlight {
  icon: IconName
  titleKey: TranslationKey
  descKey: TranslationKey
  route: RouteName
  accentClass: string
}

const highlights: Highlight[] = [
  {
    icon: 'ArrowLeftRight',
    titleKey: 'dashboard.home.highlights.transfersTitle',
    descKey: 'dashboard.home.highlights.transfersDesc',
    route: RouteName.Transfers,
    accentClass: 'highlight--teal',
  },
  {
    icon: 'TrendingUp',
    titleKey: 'dashboard.home.highlights.investTitle',
    descKey: 'dashboard.home.highlights.investDesc',
    route: RouteName.Investments,
    accentClass: 'highlight--purple',
  },
  {
    icon: 'Headphones',
    titleKey: 'dashboard.home.highlights.supportTitle',
    descKey: 'dashboard.home.highlights.supportDesc',
    route: RouteName.HelpCenter,
    accentClass: 'highlight--dark',
  },
]

const navigate = (route: RouteName) => router.push({ name: route })
</script>

<template>
  <section class="highlights-section">
    <div class="standard-container px-3 px-lg-0">
      <div class="highlights-grid">
        <button
          v-for="h in highlights"
          :key="h.titleKey"
          class="highlight-card"
          :class="h.accentClass"
          type="button"
          @click="navigate(h.route)"
        >
          <div class="highlight-card__icon-wrap">
            <BaseLucideIcon :name="h.icon" :size="22" />
          </div>
          <div class="highlight-card__body">
            <p class="highlight-card__title fw-semibold mb-1">{{ t(h.titleKey) }}</p>
            <p class="highlight-card__desc small mb-0">{{ t(h.descKey) }}</p>
          </div>
          <div class="highlight-card__arrow">›</div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.highlights-section {
  background: var(--color-bg-section-darker);
  padding: var(--spacing-lg) 0;
}

.highlights-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
}

@media (min-width: 640px) {
  .highlights-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
  }
}

/* ── Card ── */
.highlight-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-white-alpha-8);
  background: var(--color-white-alpha-5);
  color: var(--color-text-footer);
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  font-family: inherit;
  min-height: unset;
}

.highlight-card:hover {
  background: var(--color-white-alpha-10);
  border-color: var(--color-white-alpha-20);
  transform: translateY(-2px);
}

.highlight-card__icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.highlight--teal .highlight-card__icon-wrap {
  background: var(--color-teal-alpha-20);
  color: var(--color-accent-teal-1);
}

.highlight--purple .highlight-card__icon-wrap {
  background: var(--color-primary-bg-alpha-50);
  color: #c084fc;
}

.highlight--dark .highlight-card__icon-wrap {
  background: var(--color-white-alpha-10);
  color: var(--color-white-alpha-80);
}

.highlight-card__body {
  flex: 1 1 0;
  min-width: 0;
}

.highlight-card__title {
  color: var(--color-white);
  font-size: var(--font-size-sm);
}

.highlight-card__desc {
  color: var(--color-white-alpha-60);
  line-height: var(--line-height-normal);
}

.highlight-card__arrow {
  font-size: 1.25rem;
  color: var(--color-white-alpha-40);
  flex-shrink: 0;
  transition: color 0.2s ease, transform 0.2s ease;
}

.highlight-card:hover .highlight-card__arrow {
  color: var(--color-accent-teal-1);
  transform: translateX(3px);
}
</style>
