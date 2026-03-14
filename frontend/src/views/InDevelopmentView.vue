<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useTranslation } from '@/composables/useTranslation'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

const router = useRouter()
const { t } = useTranslation()

const previousRouteLabel = computed(() => {
  const backPath = router.options.history.state.back as string | null
  if (!backPath) return t('navigation.dashboard')

  // Find the matching route and read its titleKey meta
  const matched = router.resolve(backPath)
  const titleKey = matched?.meta?.titleKey
  if (titleKey && typeof titleKey === 'string') {
    return t(titleKey as TranslationKey)
  }
  return t('navigation.dashboard')
})

const goBack = () => {
  if (router.options.history.state.back) {
    router.back()
  } else {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <main class="status-page">
    <div class="standard-container">
      <section class="status-card">
        <button @click="goBack" class="back-button">
          <ArrowLeft :size="20" />
          <span>{{ t('pages.inDevelopment.goBackTo') }} {{ previousRouteLabel }}</span>
        </button>
        
        <div class="status-content">
          <h1>{{ t('pages.inDevelopment.title') }}</h1>
          <p>{{ t('pages.inDevelopment.message') }}</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.status-page {
  min-height: calc(100vh - 80px);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
}

.status-card {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 1rem;
  background: var(--color-white);
  border: 1px solid var(--color-surface-border);
  box-shadow: var(--shadow-card-strong);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  background: transparent;
  border: 1px solid var(--color-input-border);
  border-radius: 0.5rem;
  color: var(--color-text-main);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.back-button:hover {
  background: var(--color-surface);
  border-color: var(--color-primary-teal);
  color: var(--color-primary-teal);
}

.back-button:focus-visible {
  outline: 2px solid var(--color-primary-teal);
  outline-offset: 2px;
}

.status-content {
  padding: 0;
}

.status-card h1 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--color-text-main);
  line-height: 1.3;
  font-weight: 700;
}

.status-card p {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* Tablet */
@media (min-width: 640px) {
  .status-page {
    padding: var(--spacing-lg);
  }

  .status-card {
    padding: 2rem;
    border-radius: 1.25rem;
  }

  .back-button {
    font-size: 0.9375rem;
    margin-bottom: 1.25rem;
  }

  .status-card h1 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  .status-card p {
    font-size: 1.0625rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .status-card {
    max-width: 800px;
    padding: 2.5rem;
  }

  .back-button {
    margin-bottom: 1.5rem;
  }

  .status-card h1 {
    font-size: 2rem;
    margin-bottom: 1.25rem;
  }

  .status-card p {
    font-size: 1.125rem;
  }
}
</style>

