import type { NavItem } from '@/domain/navigation/types/NavItem'
import { RouteName } from '@/domain/navigation/types/RouteNames'

// ─── Public navigation ────────────────────────────────────────────────────────

export const mainLinks: NavItem[] = [
  { label: 'navigation.companies', routeName: RouteName.Companies },
  { label: 'navigation.solutions', routeName: RouteName.Solutions },
  { label: 'navigation.pricing',   routeName: RouteName.Pricing },
  { label: 'navigation.resources', routeName: RouteName.Resources },
]

export const authLinks: NavItem[] = [
  { label: 'navigation.login',       routeName: RouteName.Login,    variant: 'ghost' },
  { label: 'navigation.openAccount', routeName: RouteName.Register, variant: 'primary' },
]

// ─── Authenticated navigation ─────────────────────────────────────────────────

export const dashboardLinks: NavItem[] = [
  { label: 'navigation.dashboard', routeName: RouteName.Dashboard, icon: 'User' },
]

export const servicesLinks: NavItem[] = [
  { label: 'navigation.accounts',    routeName: RouteName.Accounts },
  { label: 'navigation.transfers',   routeName: RouteName.Transfers },
  { label: 'navigation.loans',       routeName: RouteName.Loans },
  { label: 'navigation.investments', routeName: RouteName.Investments },
]

export const supportLinks: NavItem[] = [
  { label: 'navigation.helpCenter', routeName: RouteName.HelpCenter },
  { label: 'navigation.security',   routeName: RouteName.Security },
  { label: 'navigation.contactUs',  routeName: RouteName.ContactUs },
]

// ─── Auth page links ──────────────────────────────────────────────────────────

export const authPageLinks = {
  signUp:              RouteName.Register,
  forgotPassword:      RouteName.RecoverPassword,
  socialLoginFallback: RouteName.InDevelopment,
} as const

// ─── CTA route resolution ─────────────────────────────────────────────────────

export const ctaRoutes = {
  authenticated: RouteName.Dashboard,
  guest:         RouteName.Register,
  login:         RouteName.Login,
} as const
