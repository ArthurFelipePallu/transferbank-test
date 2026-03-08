<template>
  <div class="companies-list-view">
    <div class="header">
      <h1>Companies</h1>
      <p class="subtitle">Browse all registered companies</p>
    </div>

    <div v-if="loading" class="loading">
      <p>Loading companies...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="companies.length === 0" class="empty">
      <p>No companies registered yet</p>
    </div>

    <div v-else class="companies-grid">
      <CompanyCard
        v-for="company in companies"
        :key="company.id"
        :company="company"
        @click="handleCompanyClick(company.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CompanyCard from '@/components/Company/CompanyCard.vue'
import { getAllCompanies } from '@/application/company/companyUseCases'
import type { CompanyListItem } from '@/domain/company/interfaces/companyInterface'

const router = useRouter()
const companies = ref<CompanyListItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    companies.value = await getAllCompanies()
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
.companies-list-view {
  padding: var(--spacing-page);
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: var(--spacing-section);
}

.header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 1rem;
  margin: 0;
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-muted);
}

.error {
  color: var(--color-error);
}

@media (max-width: 768px) {
  .companies-grid {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 1.5rem;
  }
}
</style>
