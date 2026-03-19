import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { RouteName } from '@/domain/navigation/types/RouteNames'
import { ctaRoutes, authPageLinks } from '@/config/navigation'

/**
 * Application-layer composable for navigation.
 * Centralises auth-aware route resolution so components never
 * hardcode route names or check auth state for routing decisions.
 */
export function useNavigation() {
  const router = useRouter()
  const authStore = useAuthStore()

  /** Navigates to dashboard if authenticated, register if guest. */
  const navigateToCta = () => {
    router.push({ name: authStore.isAuthenticated ? ctaRoutes.authenticated : ctaRoutes.guest })
  }

  /** Navigates to a typed named route. */
  const navigateTo = (routeName: RouteName) => {
    router.push({ name: routeName })
  }

  /** Route name for the primary CTA — useful for RouterLink :to bindings. */
  const ctaRouteName = authStore.isAuthenticated ? ctaRoutes.authenticated : ctaRoutes.guest

  return {
    navigateToCta,
    navigateTo,
    ctaRouteName,
    authPageLinks,
    ctaRoutes,
    RouteName,
  }
}
