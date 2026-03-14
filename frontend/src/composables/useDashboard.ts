import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePartnerStore } from '@/stores/usePartnerStore'
import { useUiStore } from '@/stores/useUiStore'
import { useTranslation } from '@/composables/useTranslation'

/**
 * Dashboard Composable
 * Application Layer - Business Logic
 * Following DDD/SOLID principles - Single Responsibility
 * Handles: authentication check, data loading, navigation
 */
export function useDashboard() {
  const router = useRouter()
  const authStore = useAuthStore()
  const partnerStore = usePartnerStore()
  const uiStore = useUiStore()
  const { t } = useTranslation()

  const loadDashboardData = async () => {
    // This is a fallback - the route guard should handle this
    if (!authStore.isAuthenticated) {
      router.push({ name: 'login' })
      return
    }

    // Load partners if company ID is available
    if (authStore.companyId) {
      await partnerStore.loadPartners()
    }
  }

  const navigateTo = (routeName: string) => {
    // Check if trying to add a partner when shareholding is already 100%
    if (routeName === 'partner-registration') {
      const totalShareholding = partnerStore.partnersCollection?.totalShareholding || 0
      
      if (totalShareholding >= 100) {
        uiStore.showWarning(t('partner.registration.toasts.shareholdingFull'))
        return
      }
    }
    
    router.push({ name: routeName })
  }

  onMounted(() => {
    loadDashboardData()
  })

  return {
    authStore,
    partnerStore,
    navigateTo,
    loadDashboardData,
  }
}
