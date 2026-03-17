<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTranslation } from '@/composables/useTranslation'
import { useAuthStore } from '@/stores/useAuthStore'
import BaseButton from '@/components/UI/BaseButton.vue'
import GradientSection from '@/components/UI/GradientSection.vue'

const { t } = useTranslation()
const authStore = useAuthStore()
const router = useRouter()

function handlePrimaryCta() {
  router.push({ name: authStore.isAuthenticated ? 'dashboard' : 'register' })
}
</script>

<template>
  <GradientSection aria-label="Hero">
    <div class="hero-inner">
      <div class="hero-content">
        <h1 class="hero-title text-white fw-bold mb-3">
          {{ t('landing.hero.tagline') }}
        </h1>
        <p class="hero-subtitle mb-4" style="color: var(--color-white-alpha-82)">
          {{ t('landing.hero.subtitle') }}
        </p>
        <div class="d-flex flex-column flex-sm-row gap-3">
          <BaseButton variant="secondary" size="lg" @click="handlePrimaryCta">
            {{ t('landing.hero.cta') }}
          </BaseButton>
          <a
            href="#features"
            class="btn btn-outline-light btn-lg rounded-3 d-inline-flex align-items-center justify-content-center"
          >
            {{ t('landing.hero.ctaSecondary') }}
          </a>
        </div>
      </div>
    </div>
  </GradientSection>
</template>

<style scoped>
.hero-inner {
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 640px;
}

.hero-title {
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-tight);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
}

@media (min-width: 768px) {
  .hero-title {
    font-size: var(--font-size-4xl);
  }
}
</style>
