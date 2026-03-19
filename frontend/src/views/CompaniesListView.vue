<template>
  <div class="companies-list-page py-3 px-3 py-md-4 px-md-4 py-lg-5 px-lg-5">
    <div class="standard-container">
      <div class="mb-4">
        <h1 class="h2 fw-semibold mb-2">{{ t('company.title') }}</h1>
        <p class="text-muted mb-0">{{ t('company.subtitle') }}</p>
      </div>

      <div v-if="loading" class="text-center py-5">
        <p class="text-muted">{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-else-if="companies.length === 0" class="text-center py-5">
        <p class="text-muted">{{ t('company.noCompanies') }}</p>
      </div>

      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="company in companies" :key="company.id" class="col">
          <CompanyCard
            :company="company"
            @click="handleCompanyClick(company.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from '@/composables/i18n/useTranslation'
import CompanyCard from '@/components/Company/CompanyCard.vue'
import { getAllCompanies } from '@/application/company/companyUseCases'
import { companyGateway } from '@/infrastructure/gateways'
import type { CompanyListItem } from '@/domain/company/interfaces/companyInterface'

const router = useRouter()
const { t } = useTranslation()
const companies = ref<CompanyListItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    companies.value = await getAllCompanies(companyGateway)
    console.log('Companies loaded:', companies.value.map(c => ({
      name: c.fantasyName || c.companyName,
      partnerCount: c.partnerCount
    })))
  } catch (err) {
    error.value = 'Failed to load companies'
    console.error('Error loading companies:', err)
  } finally {
    loading.value = false
  }
})

const handleCompanyClick = (companyId: string) => {
  // TODO: Navigate to company details view
  console.log('Company clicked:', companyId)
  // router.push({ name: 'company-details', params: { id: companyId } })
}
</script>

<style scoped>
/* No custom styles needed - using Bootstrap utilities */
</style>
