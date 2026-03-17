<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import { landingFeatures } from '@/config/landingConfig'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

const { t } = useTranslation()
</script>

<template>
  <section id="features" class="section-spacing bg-white" aria-labelledby="features-title">
    <div class="standard-container px-3 px-lg-0">

      <div class="text-center mb-5">
        <h2 id="features-title" class="fw-bold text-dark mb-2">{{ t('landing.features.title') }}</h2>
        <p class="text-muted features-subtitle mx-auto">{{ t('landing.features.subtitle') }}</p>
      </div>

      <div class="row g-4">
        <div
          v-for="feature in landingFeatures"
          :key="feature.titleKey"
          class="col-12 col-sm-6 col-lg-4"
        >
          <div class="card h-100 border card-hover p-4">
            <div class="icon-wrapper icon-wrapper-lg mb-3 feature-icon-bg">
              <BaseLucideIcon :name="feature.icon" :size="24" color="var(--color-primary-teal)" />
            </div>
            <h3 class="h6 fw-semibold text-dark mb-2">{{ t(feature.titleKey) }}</h3>
            <p class="text-muted small mb-0">{{ t(feature.descriptionKey) }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.features-subtitle {
  max-width: 520px;
}

.feature-icon-bg {
  background: var(--color-teal-alpha-10);
  border-radius: var(--border-radius-md);
}

.card {
  border-color: var(--color-surface-border) !important;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  border-color: var(--color-primary-teal) !important;
}
</style>
