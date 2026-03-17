import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

/**
 * Augments Vue Router's RouteMeta so route.meta fields are fully typed.
 * No more `meta.requiresAuth as boolean` casts anywhere in the app.
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** Redirect unauthenticated users to login. */
    requiresAuth?: boolean
    /** Redirect authenticated users away (e.g. login page). */
    requiresGuest?: boolean
    /** i18n key used to set the document title for this route. */
    titleKey?: TranslationKey
  }
}
