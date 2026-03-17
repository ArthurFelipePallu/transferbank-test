<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import { landingStats } from '@/config/landingConfig'
import StatCard from '@/components/UI/StatCard.vue'
import GradientSection from '@/components/UI/GradientSection.vue'

const { t } = useTranslation()
</script>

<template>
  <GradientSection aria-labelledby="stats-title">
    <p id="stats-title" class="text-center fw-semibold mb-5 stats-heading">
      {{ t('landing.stats.title') }}
    </p>
    <div class="row g-4">
      <div
        v-for="stat in landingStats"
        :key="stat.labelKey"
        class="col-6 col-md-3"
      >
        <StatCard
          :value="stat.value"
          :label="t(stat.labelKey)"
          variant="glass"
        />
      </div>
    </div>
  </GradientSection>
</template>

<style scoped>
.stats-heading {
  font-size: var(--font-size-lg);
  color: var(--color-white-alpha-85);
}
</style>
