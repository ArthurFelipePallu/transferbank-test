<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTranslation } from '@/composables/useTranslation'
import { landingServices } from '@/config/landingConfig'
import ActionCard from '@/components/Dashboard/ActionCard.vue'

const { t } = useTranslation()
const router = useRouter()
</script>

<template>
  <section class="section-spacing" style="background: var(--color-surface)" aria-labelledby="services-title">
    <div class="standard-container px-3 px-lg-0">

      <div class="text-center mb-5">
        <h2 id="services-title" class="fw-bold text-dark mb-2">{{ t('landing.services.title') }}</h2>
        <p class="text-muted services-subtitle mx-auto">{{ t('landing.services.subtitle') }}</p>
      </div>

      <div class="row g-4">
        <div
          v-for="service in landingServices"
          :key="service.titleKey"
          class="col-12 col-sm-6 d-flex"
        >
          <ActionCard
            class="w-100"
            :title="t(service.titleKey)"
            :description="t(service.descriptionKey)"
            :icon="service.icon"
            @click="router.push({ name: service.routeName })"
          />
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.services-subtitle {
  max-width: 480px;
}
</style>
