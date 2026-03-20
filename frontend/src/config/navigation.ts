import type { NavItem } from '@/domain/navigation/types/NavItem'
import { RouteName } from '@/domain/navigation/types/RouteNames'

// ─── Public navigation ────────────────────────────────────────────────────────

export const mainLinks: NavItem[] = [
  { label: 'navigation.companies',  routeName: RouteName.Companies,  icon: 'Building2' },
  { label: 'navigation.solutions',  routeName: RouteName.Solutions,  icon: 'Zap' },
  { label: 'navigation.pricing',    routeName: RouteName.Pricing,    icon: 'DollarSign' },
  { label: 'navigation.resources',  routeName: RouteName.Resources,  icon: 'Info' },
]

export const authLinks: NavItem[] = [
  { label: 'navigation.login',       routeName: RouteName.Login,    variant: 'ghost',   icon: 'User' },
  { label: 'navigation.openAccount', routeName: RouteName.Register, variant: 'primary', icon: 'ArrowRight' },
]

// ─── Authenticated navigation ─────────────────────────────────────────────────

export const dashboardLinks: NavItem[] = [
  { label: 'navigation.dashboard', routeName: RouteName.Dashboard, icon: 'BarChart3' },
]

export const servicesLinks: NavItem[] = [
  { label: 'navigation.accounts',    routeName: RouteName.Accounts,    icon: 'Wallet' },
  { label: 'navigation.transfers',   routeName: RouteName.Transfers,   icon: 'ArrowRight' },
  { label: 'navigation.loans',       routeName: RouteName.Loans,       icon: 'Landmark' },
  { label: 'navigation.investments', routeName: RouteName.Investments, icon: 'TrendingUp' },
]

export const supportLinks: NavItem[] = [
  { label: 'navigation.helpCenter', routeName: RouteName.HelpCenter, icon: 'Headphones' },
  { label: 'navigation.security',   routeName: RouteName.Security,   icon: 'Shield' },
  { label: 'navigation.contactUs',  routeName: RouteName.ContactUs,  icon: 'Mail' },
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
