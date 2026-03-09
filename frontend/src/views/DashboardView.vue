<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePartnersList } from '@/composables/usePartnersList'
import { useTranslation } from '@/composables/useTranslation'
import { User, ArrowRight } from 'lucide-vue-next'
import PartnersListCard from '@/components/Partner/PartnersListCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const { partnersCollection, isLoading, loadPartners } = usePartnersList()
const { t } = useTranslation()

onMounted(async () => {
  // This is a fallback - the route guard should handle this
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' })
    return
  }

  // Load partners if company ID is available
  if (authStore.companyId) {
    await loadPartners(authStore.companyId)
  }
})

const goToPartnerRegistration = () => {
  router.push({ name: 'partner-registration' })
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">{{ t('dashboard.welcomeBack') }}</h1>
          <p class="welcome-subtitle">{{ authStore.companyName }}</p>
        </div>
        <div class="welcome-icon">
          <User :size="48" />
        </div>
      </section>

      <!-- Company Info Card -->
      <section class="company-card">
        <h2 class="section-title">{{ t('dashboard.companyInfo') }}</h2>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ t('company.companyName') }}</span>
            <span class="info-value">{{ authStore.companyName || 'N/A' }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">{{ t('company.email') }}</span>
            <span class="info-value">{{ authStore.userEmail || 'N/A' }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Status</span>
            <span class="info-value status-active">Active</span>
          </div>
        </div>
      </section>

      <!-- Partners List Card -->
      <PartnersListCard 
        v-if="partnersCollection"
        :collection="partnersCollection"
        :is-loading="isLoading"
      />

      <!-- Quick Actions -->
      <section class="quick-actions">
        <h2 class="section-title">{{ t('dashboard.quickActions') }}</h2>
        
        <div class="actions-grid">
          <button class="action-card action-card-primary" @click="goToPartnerRegistration">
            <div class="action-content">
              <h3 class="action-title">{{ t('dashboard.registerPartners') }}</h3>
              <p class="action-description">{{ t('dashboard.addPartners') }}</p>
            </div>
            <ArrowRight :size="24" class="action-icon" />
          </button>

          <button class="action-card" @click="router.push({ name: 'accounts' })">
            <div class="action-content">
              <h3 class="action-title">{{ t('dashboard.manageAccounts') }}</h3>
              <p class="action-description">{{ t('dashboard.viewAccounts') }}</p>
            </div>
            <ArrowRight :size="24" class="action-icon" />
          </button>

          <button class="action-card" @click="router.push({ name: 'transfers' })">
            <div class="action-content">
              <h3 class="action-title">{{ t('dashboard.makeTransfer') }}</h3>
              <p class="action-description">{{ t('dashboard.transferFunds') }}</p>
            </div>
            <ArrowRight :size="24" class="action-icon" />
          </button>

          <button class="action-card" @click="router.push({ name: 'help-center' })">
            <div class="action-content">
              <h3 class="action-title">{{ t('dashboard.getSupport') }}</h3>
              <p class="action-description">{{ t('dashboard.accessHelp') }}</p>
            </div>
            <ArrowRight :size="24" class="action-icon" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: calc(100vh - 4rem);
  background: var(--color-background);
  padding: 1.5rem 1rem;
}

.dashboard-container {
  max-width: var(--app-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border-radius: 1rem;
  color: white;
}

.welcome-content {
  flex: 1;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.welcome-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.welcome-icon {
  display: none;
  width: 4rem;
  height: 4rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}

/* Company Card */
.company-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 1.5rem 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  color: var(--color-text);
  font-weight: 500;
}

.status-active {
  color: var(--color-primary-teal);
}

/* Quick Actions */
.quick-actions {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
}

.actions-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.action-card:hover {
  border-color: var(--color-primary-teal);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-card-primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border: none;
  color: white;
}

.action-card-primary .action-title,
.action-card-primary .action-description {
  color: white;
}

.action-card-primary .action-description {
  opacity: 0.9;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 0.25rem 0;
}

.action-description {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}

.action-icon {
  flex-shrink: 0;
  color: var(--color-primary-teal);
  transition: transform 0.2s ease;
}

.action-card-primary .action-icon {
  color: white;
}

.action-card:hover .action-icon {
  transform: translateX(4px);
}

/* Tablet and up */
@media (min-width: 640px) {
  .dashboard {
    padding: 2rem 1.5rem;
  }

  .dashboard-container {
    gap: 2rem;
  }

  .welcome-icon {
    display: flex;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .dashboard {
    padding: 3rem 2rem;
  }

  .welcome-title {
    font-size: 2.25rem;
  }

  .welcome-subtitle {
    font-size: 1.125rem;
  }

  .info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
