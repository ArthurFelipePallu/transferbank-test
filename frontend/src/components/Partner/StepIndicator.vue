<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'
import { useTranslation } from '@/composables/useTranslation'

interface FormStep {
  id: number
  title: TranslationKey
  description: TranslationKey
  isCompleted: boolean
}

defineProps<{
  steps: FormStep[]
  currentStep: number
}>()

const { t } = useTranslation()
</script>

<template>
  <div class="step-indicator">
    <div 
      v-for="(step, index) in steps" 
      :key="step.id"
      class="step-item"
      :class="{
        'step-item--active': currentStep === step.id,
        'step-item--completed': step.isCompleted,
      }"
    >
      <div class="step-number">
        <Check v-if="step.isCompleted" :size="14" :stroke-width="3" />
        <span v-else>{{ step.id }}</span>
      </div>
      
      <div class="step-content">
        <h3 class="step-title">{{ t(step.title) }}</h3>
        <p class="step-description">{{ t(step.description) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-indicator {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 1rem;
  background: var(--color-white);
  border-radius: 0.75rem;
  border: 1px solid var(--color-surface-border);
  margin-bottom: 1.5rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  position: relative;
}

.step-number {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--color-chip-bg);
  color: var(--color-text-muted);
  border: 2px solid var(--color-chip-border);
  transition: all 0.2s ease;
  flex-shrink: 0;
  z-index: 1;
}

.step-item--active .step-number {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: var(--color-white);
  border-color: var(--color-primary-teal);
  box-shadow: 0 2px 8px var(--color-teal-alpha-30);
}

.step-item--completed .step-number {
  background: var(--color-primary-teal);
  color: var(--color-white);
  border-color: var(--color-primary-teal);
}

.step-content {
  flex: 1;
  padding: 0.125rem 0 0.75rem;
  min-width: 0;
}

.step-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0 0 0.125rem;
  transition: color 0.2s ease;
  line-height: 1.3;
}

.step-item--active .step-title {
  color: var(--color-primary-teal);
}

.step-description {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.3;
  margin: 0;
}

.step-line {
  position: absolute;
  left: 0.8125rem;
  top: 2rem;
  bottom: -0.25rem;
  width: 2px;
  background: var(--color-chip-border);
  transition: background 0.2s ease;
}

.step-item--completed .step-line {
  background: var(--color-primary-teal);
}

@media (min-width: 640px) {
  .step-indicator {
    padding: 1.25rem 1.5rem;
  }

  .step-number {
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
  }

  .step-content {
    padding: 0.25rem 0 1rem;
  }

  .step-title {
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }

  .step-description {
    font-size: 0.8rem;
  }

  .step-line {
    left: 0.9375rem;
    top: 2.25rem;
  }
}

@media (min-width: 768px) {
  .step-indicator {
    flex-direction: row;
    align-items: stretch;
    padding: 1rem 1.5rem;
    gap: 0.5rem;
  }

  .step-item {
    flex: 1;
    flex-direction: row;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .step-number {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.95rem;
  }

  .step-content {
    padding: 0.25rem 0 0;
    flex: 1;
  }

  .step-title {
    font-size: 0.9rem;
  }

  .step-description {
    font-size: 0.75rem;
  }

  .step-line {
    position: absolute;
    left: auto;
    right: -0.5rem;
    top: 1rem;
    bottom: auto;
    width: 1rem;
    height: 2px;
    transform: translateX(50%);
  }

  .step-item:last-child .step-line {
    display: none;
  }
}

@media (min-width: 1024px) {
  .step-indicator {
    padding: 1.25rem 2rem;
    gap: 1rem;
  }

  .step-item {
    gap: 1rem;
  }

  .step-number {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }

  .step-title {
    font-size: 1rem;
  }

  .step-description {
    font-size: 0.8rem;
  }

  .step-line {
    width: 1.5rem;
    right: -1rem;
    top: 1.125rem;
  }
}
</style>
