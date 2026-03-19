import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePartnerStore } from '@/stores/usePartnerStore'
import { RouteName } from '@/domain/navigation/types/RouteNames'

/**
 * Dashboard Composable
 * Application Layer - Business Logic
 * Following DDD/SOLID principles - Single Responsibility
 */
export function useDashboard() {
  const router = useRouter()
  const authStore = useAuthStore()
  const partnerStore = usePartnerStore()

  const loadDashboardData = async () => {
    if (!authStore.isAuthenticated) {
      router.push({ name: RouteName.Login })
      return
    }
    if (authStore.companyId) {
      await partnerStore.loadPartners()
    }
  }

  const navigateTo = (routeName: RouteName) => {
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
