<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useExploreMenu } from '@/composables/ui/useExploreMenu'
import { useTranslation } from '@/composables/i18n/useTranslation'
import ActionCard from '@/components/Dashboard/ActionCard.vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import type { ExploreAction } from '@/config/homeExploreActions'

defineProps<{
  actions: ExploreAction[]
  sectionTitle: string
  sectionSubtitle: string
}>()

const router = useRouter()
const { t } = useTranslation()
const { isOpen, toggle, close } = useExploreMenu()

const navigate = (route: string) => {
  close()
  router.push({ name: route })
}
</script>

<template>
  <!-- DESKTOP: standard section (hidden on mobile) -->
  <section class="explore-section d-none d-sm-block">
    <div class="standard-container px-3 px-lg-0">
      <div class="mb-4">
        <h2 class="explore-section__title fw-bold mb-1">{{ sectionTitle }}</h2>
        <p class="text-muted mb-0">{{ sectionSubtitle }}</p>
      </div>
      <div class="explore-section__grid">
        <ActionCard
          v-for="action in actions"
          :key="action.route"
          :title="t(action.title)"
          :description="t(action.description)"
          :icon="action.icon"
          :variant="action.variant ?? 'default'"
          @click="navigate(action.route)"
        />
      </div>
    </div>
  </section>

  <!-- MOBILE: FAB button -->
  <button
    class="explore-fab d-sm-none"
    type="button"
    :aria-label="isOpen ? t('common.closeExploreMenu') : t('common.openExploreMenu')"
    :aria-expanded="isOpen"
    @click="toggle"
  >
    <Transition name="fab-icon" mode="out-in">
      <BaseLucideIcon v-if="!isOpen" key="open"  name="LayoutDashboard" :size="24" />
      <BaseLucideIcon v-else          key="close" name="X"               :size="24" />
    </Transition>
  </button>

  <!-- MOBILE: Slide-up sheet teleported to body -->
  <Teleport to="body">
    <Transition name="sheet-backdrop">
      <div
        v-if="isOpen"
        class="explore-backdrop d-sm-none"
        aria-hidden="true"
        @click="close"
      />
    </Transition>

    <Transition name="sheet-slide">
      <div
        v-if="isOpen"
        class="explore-sheet d-sm-none"
        role="dialog"
        aria-modal="true"
        :aria-label="t('common.explore')"
      >
        <div class="explore-sheet__header">
          <div class="explore-sheet__handle" aria-hidden="true" />
          <p class="explore-sheet__title fw-bold mb-0">{{ sectionTitle }}</p>
          <p class="explore-sheet__subtitle mb-0">{{ sectionSubtitle }}</p>
        </div>
        <div class="explore-sheet__body">
          <ActionCard
            v-for="action in actions"
            :key="action.route"
            :title="t(action.title)"
            :description="t(action.description)"
            :icon="action.icon"
            :variant="action.variant ?? 'default'"
            @click="navigate(action.route)"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.explore-section {
  padding: var(--spacing-3xl) 0;
  background: var(--color-white);
}

.explore-section__title {
  font-size: var(--font-size-2xl);
  color: var(--color-text-main);
}

.explore-section__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
}

@media (min-width: 576px) {
  .explore-section__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
}

@media (min-width: 992px) {
  .explore-section__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.explore-fab {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: var(--z-fixed);
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: var(--color-white);
  border: none;
  padding: 0;
  min-height: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px var(--color-teal-alpha-40);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.explore-fab:hover  { transform: scale(1.08); box-shadow: 0 6px 28px var(--color-teal-alpha-40); }
.explore-fab:active { transform: scale(0.95); }

.fab-icon-enter-active,
.fab-icon-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fab-icon-enter-from   { opacity: 0; transform: rotate(-90deg) scale(0.7); }
.fab-icon-leave-to     { opacity: 0; transform: rotate(90deg) scale(0.7); }

.explore-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-black-alpha-50);
  backdrop-filter: blur(2px);
  z-index: var(--z-modal-backdrop);
}

.sheet-backdrop-enter-active,
.sheet-backdrop-leave-active { transition: opacity 0.3s ease; }
.sheet-backdrop-enter-from,
.sheet-backdrop-leave-to     { opacity: 0; }

.explore-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  max-height: 85dvh;
  border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  background: linear-gradient(160deg, var(--color-primary-bg-start), var(--color-primary-bg-mid) 60%, var(--color-primary-bg-end));
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.explore-sheet__header {
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-md);
  border-bottom: 1px solid var(--color-white-alpha-10);
  flex-shrink: 0;
}

.explore-sheet__handle {
  width: 2.5rem;
  height: 0.25rem;
  background: var(--color-white-alpha-30);
  border-radius: 9999px;
  margin: 0 auto var(--spacing-sm);
}

.explore-sheet__title {
  font-size: var(--font-size-base);
  color: var(--color-white);
}

.explore-sheet__subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-white-alpha-60);
}

.explore-sheet__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding-bottom: calc(var(--spacing-md) + 5rem);
}

.sheet-slide-enter-active,
.sheet-slide-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.sheet-slide-enter-from,
.sheet-slide-leave-to     { transform: translateY(100%); }
</style>
