<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import AuthenticatedHomeView from './AuthenticatedHomeView.vue'
import LandingHero from '@/components/Landing/LandingHero.vue'
import LandingRates from '@/components/Landing/LandingRates.vue'
import LandingFeatures from '@/components/Landing/LandingFeatures.vue'
import LandingStats from '@/components/Landing/LandingStats.vue'
import LandingServices from '@/components/Landing/LandingServices.vue'
import LandingCta from '@/components/Landing/LandingCta.vue'

const { isAuthenticated } = storeToRefs(useAuthStore())
</script>

<template>
  <AuthenticatedHomeView v-if="isAuthenticated" />
  <main v-else>
    <LandingHero />
    <LandingRates />
    <LandingFeatures />
    <LandingStats />
    <LandingServices />
    <LandingCta />
  </main>
</template>
