<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import InfoItem from './InfoItem.vue'

export interface CompanyInfo {
  name: string
  email: string
  status: string
}

defineProps<{
  title: string
  info: CompanyInfo
}>()

const { t } = useTranslation()
</script>

<template>
  <section class="card mb-4">
    <div class="card-body p-4">
      <h2 class="h4 fw-semibold mb-4">{{ title }}</h2>
      
      <div class="row g-4">
        <div class="col-12 col-sm-6 col-lg-4">
          <InfoItem 
            :label="t('company.companyName')" 
            :value="info.name || 'N/A'" 
          />
        </div>

        <div class="col-12 col-sm-6 col-lg-4">
          <InfoItem 
            :label="t('company.email')" 
            :value="info.email || 'N/A'" 
          />
        </div>

        <div class="col-12 col-sm-6 col-lg-4">
          <InfoItem 
            :label="t('dashboard.status')" 
            :value="info.status" 
            variant="success"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Minimal styling - relies on Bootstrap */
</style>
