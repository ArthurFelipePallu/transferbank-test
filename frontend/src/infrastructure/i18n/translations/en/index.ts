import { common } from './common'
import { auth } from './auth'
import { navigation } from './navigation'
import { dashboard } from './dashboard'
import { company } from './company'
import { partner } from './partner'
import { onboarding } from './onboarding'
import { address } from './address'
import { currency } from './currency'
import { pricing } from './pricing'
import { status } from './status'
import { errors } from './errors'
import { validation } from './validation'
import { footer } from './footer'
import { fileUpload } from './fileUpload'
import { pages } from './pages'
import { cookies } from './cookies'
import { landing } from './landing'

export const en = {
  common,
  auth,
  navigation,
  dashboard,
  company,
  partner,
  onboarding,
  address,
  currency,
  pricing,
  status,
  errors,
  validation,
  footer,
  fileUpload,
  pages,
  cookies,
  landing,
}

export type TranslationKeys = typeof en

/**
 * Recursively builds a union of all valid dot-notation key paths.
 * e.g. 'common.loading' | 'auth.login' | ...
 */
type DotPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends Record<string, unknown>
      ? DotPaths<T[K], `${Prefix}${K}.`>
      : `${Prefix}${K}`
}[keyof T & string]

export type TranslationKey = DotPaths<TranslationKeys>
