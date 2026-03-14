<script setup lang="ts">
import ActionCard from './ActionCard.vue'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

export interface QuickAction {
  title: TranslationKey
  description: TranslationKey
  route: string
  variant?: 'default' | 'primary'
}

export interface TranslatedAction {
  title: string
  description: string
  route: string
  variant?: 'default' | 'primary'
}

defineProps<{
  title: string
  actions: TranslatedAction[]
}>()

const emit = defineEmits<{
  navigate: [route: string]
}>()
</script>

<template>
  <section class="card">
    <div class="card-body p-4">
      <h2 class="h4 fw-semibold mb-4">{{ title }}</h2>
      
      <div class="row g-3">
        <div 
          v-for="action in actions" 
          :key="action.route"
          class="col-12 col-sm-6"
        >
          <ActionCard
            :title="action.title"
            :description="action.description"
            :variant="action.variant"
            @click="emit('navigate', action.route)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Minimal styling - relies on Bootstrap */
</style>
