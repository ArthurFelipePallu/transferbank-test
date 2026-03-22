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

const animatingConnector = ref<number | null>(null)

watch(
  () => props.currentStep,
  (next, prev) => {
    if (next > prev) {
      const connectorIdx = props.steps.findIndex(s => s.id === prev)
      if (connectorIdx !== -1) {
        animatingConnector.value = connectorIdx
        setTimeout(() => { animatingConnector.value = null }, 600)
      }
    }
  },
)
</script>

<template>
  <nav
    class="w-100 px-3 px-md-4 py-2 bg-white border rounded-3 overflow-hidden"
    :aria-label="navAriaLabel"
  >
    <div class="d-flex align-items-start w-100">
      <template v-for="(step, i) in steps" :key="step.id">

        <div
          class="step-node d-flex flex-column align-items-center flex-shrink-0"
          :class="{ 'step-node--active': currentStep === step.id }"
          :aria-current="currentStep === step.id ? 'step' : undefined"
        >
          <StepBubble
            :index="i + 1"
            :is-active="currentStep === step.id"
            :is-completed="step.isCompleted"
            :show-checkmark="step.id < currentStep"
          />
          <span class="step-node__title d-none d-sm-block text-center fw-semibold text-truncate">
            {{ t(step.title) }}
          </span>
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
.step-node {
  gap: var(--spacing-xs);
}

.step-node__title {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  max-width: 6rem;
  line-height: var(--line-height-tight);
  transition: color 0.2s ease;
}

.step-node--active .step-node__title {
  color: var(--color-primary-teal);
}

@media (min-width: 640px) {
  .step-node {
    flex-shrink: 1;
    min-width: 3.5rem;
    max-width: 7rem;
  }

  .step-node__title {
    max-width: 7.5rem;
  }
}
</style>
