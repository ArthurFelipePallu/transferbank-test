import { createRouter, createWebHistory } from 'vue-router'
import NotFoundView from '../views/NotFoundView.vue'
import OnBoardingView from '../views/OnboardingView.vue'
import InDevelopmentView from '../views/InDevelopmentView.vue'
import AlreadyExistingView from '@/views/AlreadyExistingView.vue'
import AccountCreatedView from '@/views/AccountCreatedView.vue'
import PartnerRegisteredView from '@/views/PartnerRegisteredView.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import PartnerRegistrationView from '@/views/PartnerRegistrationView.vue'
import { browserScrollService } from '@/infrastructure/scroll/BrowserScrollService'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUiStore } from '@/stores/useUiStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // If there's a saved position (browser back/forward), use it
    if (savedPosition) {
      browserScrollService.scrollTo({
        ...savedPosition,
        behavior: 'smooth',
      })
      return savedPosition
    }
    
    // If navigating to a hash (anchor), scroll to it
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80, // Offset for fixed header
      }
    }
    
    // Default: scroll to top with smooth animation
    browserScrollService.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'register' },
    },
    {
      path: '/sign-up',
      name: 'register',
      component: OnBoardingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/account-created',
      name: 'account-created',
      component: AccountCreatedView,
    },
    {
      path: '/account-exists',
      name: 'account-exists',
      component: AlreadyExistingView,
    },
    {
      path: '/partner-registration',
      name: 'partner-registration',
      component: PartnerRegistrationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/partner-registered',
      name: 'partner-registered',
      component: PartnerRegisteredView,
      meta: { requiresAuth: true },
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('../views/CompaniesListView.vue'),
    },
    {
      path: '/solutions',
      name: 'solutions',
      component: InDevelopmentView,
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: InDevelopmentView,
    },
    {
      path: '/resources',
      name: 'resources',
      component: InDevelopmentView,
    },
    {
      path: '/services',
      children: [
        {
          path: 'accounts',
          name: 'accounts',
          component: InDevelopmentView,
          meta: { requiresAuth: true },
        },
        {
          path: 'transfers',
          name: 'transfers',
          component: InDevelopmentView,
          meta: { requiresAuth: true },
        },
        {
          path: 'loans',
          name: 'loans',
          component: InDevelopmentView,
          meta: { requiresAuth: true },
        },
        {
          path: 'investments',
          name: 'investments',
          component: InDevelopmentView,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/support',
      children: [
        {
          path: 'help-center',
          name: 'help-center',
          component: InDevelopmentView,
        },
        {
          path: 'security',
          name: 'security',
          component: InDevelopmentView,
        },
        {
          path: 'report-fraud',
          name: 'report-fraud',
          component: InDevelopmentView,
        },
        {
          path: 'contact-us',
          name: 'contact-us',
          component: InDevelopmentView,
        },
        {
          path: 'recover-password',
          name: 'recover-password',
          component: InDevelopmentView,
        },
      ],
    },
    {
      path: '/in-development',
      name: 'in-development',
      component: InDevelopmentView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Check if route requires authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    uiStore.showError('Please login to access this page', 5000)
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check if route requires guest (redirect authenticated users)
  if (requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }
  
  next()
})

export default router
