import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { RouteName } from '@/domain/navigation/types/RouteNames'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUiStore } from '@/stores/useUiStore'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { translationService } from '@/infrastructure/i18n/TranslationService'

/**
 * Registers all global navigation guards on the router.
 * Each guard has a single responsibility — kept separate for clarity and testability.
 */
export function registerGuards(router: Router): void {
  router.beforeEach((to, from, next) => {
    _clearOnboardingCacheOnLeave(from.name as RouteName | undefined, to.name as RouteName | undefined)
    _enforceAuthRules(to, next)
  })
}

/** Clears the onboarding form cache when the user navigates away from the sign-up route */
function _clearOnboardingCacheOnLeave(
  fromName: RouteName | undefined,
  toName: RouteName | undefined,
): void {
  if (fromName === RouteName.Register && toName !== RouteName.Register) {
    useOnboardingStore().clearFormCache()
  }
}

/** Enforces auth/guest route access rules */
function _enforceAuthRules(to: RouteLocationNormalized, next: NavigationGuardNext): void {
  const authStore = useAuthStore()
  const uiStore = useUiStore()

  const requiresAuth  = to.matched.some((r) => r.meta.requiresAuth)
  const requiresGuest = to.matched.some((r) => r.meta.requiresGuest)

  if (requiresAuth && !authStore.isAuthenticated) {
    uiStore.showError(translationService.t('errors.pleaseLogin'), 5000)
    next({ name: RouteName.Login, query: { redirect: to.fullPath } })
    return
  }

  if (requiresGuest && authStore.isAuthenticated) {
    next({ name: RouteName.Dashboard })
    return
  }

  next()
}
