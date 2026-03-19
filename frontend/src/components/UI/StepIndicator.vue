<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import type { StepItem } from '@/domain/ui/types/StepItem'
import StepBubble from '@/components/UI/StepBubble.vue'
import StepConnector from '@/components/UI/StepConnector.vue'

const props = defineProps<{
  steps: StepItem[]
  currentStep: number
  ariaLabel?: string
}>()

const { t } = useTranslation()

const navAriaLabel = computed(() => props.ariaLabel ?? t('validation.formProgress'))

/**
 * Track which connector index is currently animating (0-based, between step i and i+1).
 * When currentStep advances, we animate the connector that was just completed.
 */
const animatingConnector = ref<number | null>(null)

watch(
  () => props.currentStep,
  (next, prev) => {
    if (next > prev) {
      // User moved forward — animate the connector between prev step and next step
      // Connector index = prev step index in the steps array (0-based)
      const connectorIdx = props.steps.findIndex(s => s.id === prev)
      if (connectorIdx !== -1) {
        animatingConnector.value = connectorIdx
        // Clear after animation completes so it stays filled but not "animating"
        setTimeout(() => { animatingConnector.value = null }, 600)
      }
    }
  },
)
</script>

<template>
  <nav class="step-indicator" :aria-label="navAriaLabel">

    <!-- Row 1: bubbles + connectors perfectly centered -->
    <div class="step-track">
      <template v-for="(step, i) in steps" :key="step.id">
        <div
          class="step-node"
          :class="{
            'step-node--active': currentStep === step.id,
            'step-node--completed': step.isCompleted,
          }"
          :aria-current="currentStep === step.id ? 'step' : undefined"
        >
          <StepBubble
            :index="i + 1"
            :is-active="currentStep === step.id"
            :is-completed="step.isCompleted"
          />
          <span class="step-node__title">{{ t(step.title) }}</span>
        </div>

        <StepConnector
          v-if="i < steps.length - 1"
          :is-completed="step.isCompleted"
          :is-animating="animatingConnector === i"
        />
      </template>
    </div>

  </nav>
</template>

<style scoped>
.step-indicator {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-white);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

/* Single flex row — bubbles and connectors share the same baseline */
.step-track {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

/* Each step node: bubble on top, label below */
.step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

/* Connector stretches between nodes, aligned to bubble center */
/* StepConnector itself handles the flex:1 */

.step-node__title {
  display: none;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 6rem;
  line-height: var(--line-height-tight);
  transition: color 0.2s ease;
}

.step-node--active .step-node__title  { color: var(--color-primary-teal); }
.step-node--completed .step-node__title { color: var(--color-text-muted); }

@media (min-width: 640px) {
  .step-node__title { display: block; }
  .step-node { flex-shrink: 1; min-width: 3.5rem; max-width: 7rem; }
}

@media (min-width: 768px) {
  .step-indicator { padding: var(--spacing-sm) var(--spacing-lg); }
  .step-node__title { font-size: var(--font-size-xs); max-width: 7.5rem; }
}
</style>
