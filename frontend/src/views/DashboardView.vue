<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'
import { useDashboard } from '@/composables/domain/useDashboard'
import { dashboardActionsConfig } from '@/config/dashboardActions'
import WelcomeCard from '@/components/Dashboard/WelcomeCard.vue'
import CompanyInfoCard from '@/components/Dashboard/CompanyInfoCard.vue'
import QuickActionsCard from '@/components/Dashboard/QuickActionsCard.vue'
import type { TranslatedAction } from '@/components/Dashboard/QuickActionsCard.vue'
import PartnersListCard from '@/components/Partner/PartnersListCard.vue'

const { t } = useTranslation()
const { authStore, partnerStore, navigateTo } = useDashboard()

// Computed properties for clean template
const companyInfo = computed(() => ({
  name: authStore.companyName || '',
  email: authStore.userEmail || '',
  status: t('company.active'),
}))

// Translate action titles and descriptions
const translatedActions = computed<TranslatedAction[]>(() =>
  dashboardActionsConfig.map(action => ({
    ...action,
    title: t(action.title as TranslationKey),
    description: t(action.description as TranslationKey),
  }))
)
</script>

<template>
  <div class="container-fluid dashboard py-3 px-3 py-md-4 px-md-4 py-lg-5 px-lg-5">
    <div class="standard-container">
      <!-- Welcome Section -->
      <WelcomeCard 
        :title="t('dashboard.welcomeBack')"
        :subtitle="authStore.companyName || ''"
      />

      <!-- Company Info Card -->
      <CompanyInfoCard 
        :title="t('dashboard.companyInfo')"
        :info="companyInfo"
      />

      <!-- Partners List Card -->
      <PartnersListCard 
        v-if="partnerStore.partnersCollection"
        :collection="partnerStore.partnersCollection"
        :is-loading="partnerStore.isLoadingList"
      />

      <!-- Quick Actions -->
      <QuickActionsCard 
        :title="t('dashboard.quickActions')"
        :actions="translatedActions"
        @navigate="navigateTo"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  background: var(--bs-body-bg);
}
</style>
