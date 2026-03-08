import { createRouter, createWebHistory } from 'vue-router'
import NotFoundView from '../views/NotFoundView.vue'
import OnBoardingView from '../views/OnboardingView.vue'
import InDevelopmentView from '../views/InDevelopmentView.vue'
import AlreadyExistingView from '@/views/AlreadyExistingView.vue'
import AccountCreatedView from '@/views/AccountCreatedView.vue'
import LoginView from '@/views/LoginView.vue'
import PartnerRegistrationView from '@/views/PartnerRegistrationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
        },
        {
          path: 'transfers',
          name: 'transfers',
          component: InDevelopmentView,
        },
        {
          path: 'loans',
          name: 'loans',
          component: InDevelopmentView,
        },
        {
          path: 'investments',
          name: 'investments',
          component: InDevelopmentView,
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

export default router
