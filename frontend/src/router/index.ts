import { createRouter, createWebHistory } from 'vue-router'
import NotFoundView from '../views/NotFoundView.vue'
import OnBoardingView from '../views/OnboardingView.vue'
import InDevelopmentView from '../views/InDevelopmentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'onboarding',
      component: OnBoardingView,
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
