<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePartnerEditStore } from '@/stores/usePartnerEditStore'
import { useUiStore } from '@/stores/useUiStore'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { RouteName } from '@/domain/navigation/types/RouteNames'
import PartnersStep from '@/components/Onboarding/steps/PartnersStep.vue'

const router = useRouter()
const store = usePartnerEditStore()
const uiStore = useUiStore()
const { t } = useTranslation()

onMounted(async () => {
  uiStore.startLoading(t('common.loading'))
  try {
    await store.loadPartners()
  } finally {
    uiStore.stopLoading()
  }
})

const handleDone = () => router.push({ name: RouteName.Dashboard })
</script>

<template>
  <main class="py-3 px-3 py-md-4 px-md-4 py-lg-5 px-lg-5" style="background: var(--bs-light); min-height: 100vh">
    <div class="standard-container">
      <header class="mb-4">
        <h1 class="h3 fw-bold mb-1">{{ t('partner.editPage.title') }}</h1>
        <p class="text-muted mb-0">{{ t('partner.editPage.subtitle') }}</p>
      </header>

      <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
          <PartnersStep
            :store="store"
            :show-navigation="false"
            @next="handleDone"
            @back="handleDone"
          />
        </div>
      </div>
    </div>
  </main>
</template>
