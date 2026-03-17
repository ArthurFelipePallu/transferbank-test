<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTranslation } from '@/composables/useTranslation'
import { useAuthStore } from '@/stores/useAuthStore'
import BaseButton from '@/components/UI/BaseButton.vue'
import GradientSection from '@/components/UI/GradientSection.vue'

const { t } = useTranslation()
const authStore = useAuthStore()
const router = useRouter()

function handleCta() {
  router.push({ name: authStore.isAuthenticated ? 'dashboard' : 'register' })
}
</script>

<template>
  <GradientSection aria-labelledby="cta-title" content-class="text-center">
    <h2 id="cta-title" class="fw-bold text-white mb-3 cta-title">
      {{ t('landing.cta.title') }}
    </h2>
    <p class="cta-subtitle mb-4 mx-auto">{{ t('landing.cta.subtitle') }}</p>
    <BaseButton variant="secondary" size="lg" @click="handleCta">
      {{ t('landing.cta.button') }}
    </BaseButton>
    <p class="cta-login mt-3 mb-0">
      {{ t('landing.cta.login') }}
      <RouterLink :to="{ name: 'login' }" class="cta-login-link fw-semibold ms-1">
        {{ t('landing.cta.loginLink') }}
      </RouterLink>
    </p>
  </GradientSection>
</template>

<style scoped>
.cta-title {
  font-size: var(--font-size-3xl);
}

.cta-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-white-alpha-80);
  max-width: 480px;
}

.cta-login {
  font-size: var(--font-size-sm);
  color: var(--color-white-alpha-70);
}

.cta-login-link {
  color: var(--color-white);
  text-decoration: underline;
  min-height: unset;
  display: inline;
}

.cta-login-link:hover {
  color: var(--color-white-alpha-85);
}

@media (min-width: 768px) {
  .cta-title {
    font-size: var(--font-size-4xl);
  }
}
</style>
