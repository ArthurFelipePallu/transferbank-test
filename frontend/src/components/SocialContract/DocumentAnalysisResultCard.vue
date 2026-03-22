<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import {
  CRITERION_KEYS,
  CRITERION_SCORE_HIGH,
  CRITERION_SCORE_MEDIUM,
  formatConfidence,
} from '@/domain/socialContract/entities/DocumentAnalysisResult'
import type { DocumentAnalysisResult, CriterionKey } from '@/domain/socialContract/entities/DocumentAnalysisResult'
import type { IconName } from '@/utils/LucideIconMap'

defineProps<{ result: DocumentAnalysisResult }>()

const { t } = useTranslation()

const criterionIcon = (score: number): IconName => {
  if (score >= CRITERION_SCORE_HIGH) return 'CheckCircle'
  if (score >= CRITERION_SCORE_MEDIUM) return 'TriangleAlert'
  return 'XCircle'
}

const criterionColorClass = (score: number): string => {
  if (score >= CRITERION_SCORE_HIGH) return 'text-success'
  if (score >= CRITERION_SCORE_MEDIUM) return 'text-warning'
  return 'text-danger'
}

const criterionLabel = (key: CriterionKey): string =>
  t(`onboarding.socialContractStep.aiCriteria.${key}`)
</script>

<template>
  <div
    class="border rounded-2 p-3"
    :class="result.isValid ? 'border-success bg-body-secondary' : 'border-danger bg-danger-subtle'"
  >
    <!-- Header -->
    <div class="d-flex align-items-center justify-content-between mb-2">
      <p
        class="small fw-semibold mb-0 d-flex align-items-center gap-1"
        :class="result.isValid ? 'text-success' : 'text-danger'"
      >
        <BaseLucideIcon :name="result.isValid ? 'CheckCircle' : 'XCircle'" :size="14" />
        {{ result.isValid ? t('onboarding.socialContractStep.aiValid') : t('onboarding.socialContractStep.aiInvalid') }}
      </p>
      <span class="badge rounded-pill" :class="result.isValid ? 'text-bg-success' : 'text-bg-danger'">
        {{ t('onboarding.socialContractStep.aiConfidence') }}: {{ formatConfidence(result.confidenceIndex) }}
      </span>
    </div>

    <!-- Overall reason -->
    <p class="small text-muted mb-2">{{ result.reason }}</p>

    <!-- Confidence bar -->
    <div
      class="progress mb-3 confidence-bar"
      role="progressbar"
      :aria-valuenow="Math.round(result.confidenceIndex * 100)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="progress-bar"
        :class="result.isValid ? 'bg-success' : 'bg-danger'"
        :style="{ width: formatConfidence(result.confidenceIndex) }"
      />
    </div>

    <!-- Per-criterion breakdown -->
    <ul class="list-unstyled mb-0 d-flex flex-column gap-1">
      <li
        v-for="key in CRITERION_KEYS"
        :key="key"
        class="d-flex align-items-start gap-2 small"
      >
        <BaseLucideIcon
          :name="criterionIcon(result.criteria[key].score)"
          :size="13"
          class="flex-shrink-0 mt-1"
          :class="criterionColorClass(result.criteria[key].score)"
        />
        <div class="flex-grow-1">
          <span class="fw-semibold">{{ criterionLabel(key) }}</span>
          <span class="text-muted ms-1">({{ formatConfidence(result.criteria[key].score) }})</span>
          <span v-if="result.criteria[key].notes" class="d-block text-muted opacity-75">
            {{ result.criteria[key].notes }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.confidence-bar {
  height: var(--confidence-bar-height, 6px);
}
</style>
