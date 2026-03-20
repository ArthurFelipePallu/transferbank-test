<script setup lang="ts">
import ActionCard from './ActionCard.vue'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'
import type { RouteName } from '@/domain/navigation/types/RouteNames'
import type { IconName } from '@/utils/LucideIconMap'

export interface QuickAction {
  title: TranslationKey
  description: TranslationKey
  route: RouteName
  variant?: 'default' | 'primary'
  icon?: IconName
}

export interface TranslatedAction {
  title: string
  description: string
  route: RouteName
  variant?: 'default' | 'primary'
  icon?: IconName
}

defineProps<{
  title: string
  actions: TranslatedAction[]
}>()

const emit = defineEmits<{
  navigate: [route: RouteName]
}>()
</script>

<template>
  <section class="card">
    <div class="card-body p-3 p-md-4">
      <h2 class="h4 fw-semibold mb-3">{{ title }}</h2>

      <div class="actions-grid">
        <ActionCard
          v-for="action in actions"
          :key="action.route"
          :title="action.title"
          :description="action.description"
          :variant="action.variant"
          :icon="action.icon"
          @click="emit('navigate', action.route)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.actions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
}

@media (min-width: 500px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
}
</style>
