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

  router.afterEach((to) => {
    _setPageTitle(to)
  })
}

/**
 * Fully resets the onboarding store when the user navigates away from the
 * sign-up route to any other route. This clears form data, step progress,
 * completed-step flags, and the persisted cache so the user always starts
 * fresh on their next visit.
 *
 * Navigating from the sign-up route back to itself (e.g. a page reload that
 * resolves to the same route) is intentionally excluded so the store can
 * re-hydrate from cache and restore the user's progress.
 */
function _clearOnboardingCacheOnLeave(
  fromName: RouteName | undefined,
  toName: RouteName | undefined,
): void {
  if (fromName === RouteName.Register && toName !== RouteName.Register) {
    useOnboardingStore().resetOnboarding()
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

/** Sets document.title from the route's titleKey meta, falling back to the app name */
function _setPageTitle(to: RouteLocationNormalized): void {
  const APP_NAME = 'Mediteranian Bank'
  const titleKey = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta.titleKey)?.meta.titleKey as string | undefined

  document.title = titleKey
    ? `${translationService.t(titleKey as Parameters<typeof translationService.t>[0])} | ${APP_NAME}`
    : APP_NAME
}
