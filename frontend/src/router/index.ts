import { createRouter, createWebHistory } from 'vue-router'
import NotFoundView from '../views/NotFoundView.vue'
import OnBoardingView from '../views/OnboardingView.vue'
import InDevelopmentView from '../views/InDevelopmentView.vue'
import AlreadyExistingView from '@/views/AlreadyExistingView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'onboarding',
      component: OnBoardingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
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
      ],
    },
    {
      path: '/in-development',
      name: 'in-development',
      component: InDevelopmentView,
    },
    {
      path: '/already-exists',
      name: 'already-exists',
      component: AlreadyExistingView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router
