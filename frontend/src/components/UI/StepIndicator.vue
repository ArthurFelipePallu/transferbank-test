<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import type { StepItem } from '@/domain/ui/types/StepItem'
import StepBubble from '@/components/UI/StepBubble.vue'
import StepConnector from '@/components/UI/StepConnector.vue'

const props = defineProps<{
  steps: StepItem[]
  currentStep: number
  /** Accessible label for the nav landmark — defaults to translated 'Form progress' */
  ariaLabel?: string
}>()

const { t } = useTranslation()

const navAriaLabel = computed(() => props.ariaLabel ?? t('validation.formProgress'))

/** Build a flat list interleaving step nodes and connector nodes */
const nodes = computed(() => {
  const result: Array<{ type: 'step'; step: StepItem; index: number } | { type: 'connector'; completed: boolean }> = []
  props.steps.forEach((step, i) => {
    result.push({ type: 'step', step, index: i + 1 })
    if (i < props.steps.length - 1) {
      result.push({ type: 'connector', completed: step.isCompleted })
    }
  })
  return result
})
</script>

<template>
  <nav class="step-indicator" :aria-label="navAriaLabel">
    <template v-for="(node, i) in nodes" :key="i">

      <!-- Connector line -->
      <StepConnector
        v-if="node.type === 'connector'"
        :is-completed="node.completed"
      />

      <!-- Step node -->
      <div
        v-else-if="node.type === 'step'"
        class="step-node"
        :class="{
          'step-node--active': currentStep === node.step.id,
          'step-node--completed': node.step.isCompleted,
        }"
        :aria-current="currentStep === node.step.id ? 'step' : undefined"
      >
        <StepBubble
          :index="node.index"
          :is-active="currentStep === node.step.id"
          :is-completed="node.step.isCompleted"
        />

        <!-- Title — hidden on mobile, shown on desktop -->
        <span class="step-node__title">{{ t(node.step.title) }}</span>
      </div>

    </template>
  </nav>
</template>

<style scoped>
/* ── Container ───────────────────────────────────────────────────────────── */
.step-indicator {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-white);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--border-radius-lg);
  gap: 0;
}

/* ── Step node ───────────────────────────────────────────────────────────── */
.step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  flex-shrink: 0;
  min-width: 0;
}

/* ── Title — mobile: hidden; desktop: visible ────────────────────────────── */
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

.step-node--active .step-node__title {
  color: var(--color-primary-teal);
}

.step-node--completed .step-node__title {
  color: var(--color-text-muted);
}

/* ── Desktop: show titles, allow connectors to flex ─────────────────────── */
@media (min-width: 640px) {
  .step-indicator {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .step-node__title {
    display: block;
  }

  .step-node {
    flex-shrink: 1;
    min-width: 3.5rem;
    max-width: 7rem;
  }
}

@media (min-width: 768px) {
  .step-indicator {
    padding: var(--spacing-sm) var(--spacing-lg);
  }

  .step-node__title {
    font-size: var(--font-size-xs);
    max-width: 7.5rem;
  }
}
</style>
