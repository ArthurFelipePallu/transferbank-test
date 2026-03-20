import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/domain/navigation/types/RouteNames'
import { browserScrollService } from '@/infrastructure/scroll/BrowserScrollService'
import { registerGuards } from '@/router/guards'

// ─── Eager-loaded views (above the fold / always needed) ─────────────────────
import LandingView from '@/views/LandingView.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import OnBoardingView from '@/views/OnboardingView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import InDevelopmentView from '@/views/InDevelopmentView.vue'

// ─── Lazy-loaded views ────────────────────────────────────────────────────────
const AccountCreatedView  = () => import('@/views/AccountCreatedView.vue')
const AlreadyExistingView = () => import('@/views/AlreadyExistingView.vue')
const PartnerEditView     = () => import('@/views/PartnerEditView.vue')
const PartnerRegisteredView = () => import('@/views/PartnerRegisteredView.vue')
const CompaniesListView   = () => import('@/views/CompaniesListView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      browserScrollService.scrollTo({ ...savedPosition, behavior: 'smooth' })
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 }
    }
    browserScrollService.scrollTo({ top: 0, behavior: 'smooth' })
    return { top: 0 }
  },

  routes: [
    // ─── Public ────────────────────────────────────────────────────────────
    {
      path: '/',
      name: RouteName.Home,
      component: LandingView,
      meta: { titleKey: 'landing.hero.tagline' },
    },
    {
      path: '/sign-up',
      name: RouteName.Register,
      component: OnBoardingView,
      meta: { titleKey: 'onboarding.title' },
    },
    {
      path: '/login',
      name: RouteName.Login,
      component: LoginView,
      meta: { requiresGuest: true, titleKey: 'auth.login' },
    },
    {
      path: '/companies',
      name: RouteName.Companies,
      component: CompaniesListView,
      meta: { titleKey: 'company.title' },
    },
    {
      path: '/solutions',
      name: RouteName.Solutions,
      component: InDevelopmentView,
      meta: { titleKey: 'navigation.solutions' },
    },
    {
      path: '/pricing',
      name: RouteName.Pricing,
      component: InDevelopmentView,
      meta: { titleKey: 'navigation.pricing' },
    },
    {
      path: '/resources',
      name: RouteName.Resources,
      component: InDevelopmentView,
      meta: { titleKey: 'navigation.resources' },
    },

    // ─── Authenticated ──────────────────────────────────────────────────────
    {
      path: '/dashboard',
      name: RouteName.Dashboard,
      component: DashboardView,
      meta: { requiresAuth: true, titleKey: 'navigation.dashboard' },
    },

    // ─── Account status ─────────────────────────────────────────────────────
    {
      path: '/account',
      children: [
        {
          path: 'created',
          name: RouteName.AccountCreated,
          component: AccountCreatedView,
          meta: { titleKey: 'status.accountCreated.title' },
        },
        {
          path: 'exists',
          name: RouteName.AccountExists,
          component: AlreadyExistingView,
          meta: { titleKey: 'status.accountExists.title' },
        },
      ],
    },

    // ─── Partner ────────────────────────────────────────────────────────────
    {
      path: '/partner',
      children: [
        {
          path: 'edit',
          name: RouteName.PartnerEdit,
          component: PartnerEditView,
          meta: { requiresAuth: true, titleKey: 'partner.editPage.title' },
        },
        {
          path: 'registered',
          name: RouteName.PartnerRegistered,
          component: PartnerRegisteredView,
          meta: { requiresAuth: true, titleKey: 'status.partnerRegistered.title' },
        },
      ],
    },

    // ─── Services ───────────────────────────────────────────────────────────
    {
      path: '/services',
      children: [
        {
          path: 'accounts',
          name: RouteName.Accounts,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.accounts' },
        },
        {
          path: 'transfers',
          name: RouteName.Transfers,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.transfers' },
        },
        {
          path: 'loans',
          name: RouteName.Loans,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.loans' },
        },
        {
          path: 'investments',
          name: RouteName.Investments,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.investments' },
        },
      ],
    },

    // ─── Services ───────────────────────────────────────────────────────────
    {
      path: '/services',
      children: [
        {
          path: 'accounts',
          name: RouteName.Accounts,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.accounts' },
        },
        {
          path: 'transfers',
          name: RouteName.Transfers,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.transfers' },
        },
        {
          path: 'loans',
          name: RouteName.Loans,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.loans' },
        },
        {
          path: 'investments',
          name: RouteName.Investments,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.investments' },
        },
      ],
    },

    // ─── Explore (authenticated content hub) ────────────────────────────────
    {
      path: '/explore',
      children: [
        {
          path: 'activity',
          name: RouteName.ActivityHistory,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.activityHistory' },
        },
        {
          path: 'newsletter',
          name: RouteName.Newsletter,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.newsletter' },
        },
        {
          path: 'products',
          name: RouteName.Products,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.products' },
        },
        {
          path: 'bank-content',
          name: RouteName.BankContent,
          component: InDevelopmentView,
          meta: { requiresAuth: true, titleKey: 'navigation.bankContent' },
        },
      ],
    },
    {
      path: '/support',
      children: [
        {
          path: 'help-center',
          name: RouteName.HelpCenter,
          component: InDevelopmentView,
          meta: { titleKey: 'navigation.helpCenter' },
        },
        {
          path: 'security',
          name: RouteName.Security,
          component: InDevelopmentView,
          meta: { titleKey: 'navigation.security' },
        },
        {
          path: 'report-fraud',
          name: RouteName.ReportFraud,
          component: InDevelopmentView,
          meta: { titleKey: 'footer.reportFraud' },
        },
        {
          path: 'contact-us',
          name: RouteName.ContactUs,
          component: InDevelopmentView,
          meta: { titleKey: 'navigation.contactUs' },
        },
        {
          path: 'recover-password',
          name: RouteName.RecoverPassword,
          component: InDevelopmentView,
          meta: { titleKey: 'auth.forgotPassword' },
        },
      ],
    },

    // ─── Legal ──────────────────────────────────────────────────────────────
    {
      path: '/legal',
      children: [
        {
          path: 'cookie-policy',
          name: RouteName.CookiePolicy,
          component: InDevelopmentView,
          meta: { titleKey: 'cookies.cookiePolicy' },
        },
        {
          path: 'privacy-policy',
          name: RouteName.PrivacyPolicy,
          component: InDevelopmentView,
          meta: { titleKey: 'cookies.privacyPolicy' },
        },
        {
          path: 'accessibility',
          name: RouteName.Accessibility,
          component: InDevelopmentView,
          meta: { titleKey: 'cookies.accessibility' },
        },
      ],
    },

    // ─── Misc ────────────────────────────────────────────────────────────────
    {
      path: '/in-development',
      name: RouteName.InDevelopment,
      component: InDevelopmentView,
      meta: { titleKey: 'pages.inDevelopment.title' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: RouteName.NotFound,
      component: NotFoundView,
    },
  ],
})

// ─── Navigation guards ────────────────────────────────────────────────────────
registerGuards(router)

export default router
