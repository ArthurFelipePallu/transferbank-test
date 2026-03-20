<script setup lang="ts">
import { homeSlides } from '@/config/homeSlides'
import { homeExploreActions } from '@/config/homeExploreActions'
import HomeCarousel from '@/components/Home/HomeCarousel.vue'
import HomeHighlightsSection from '@/components/Home/HomeHighlightsSection.vue'
import HomeExploreSection from '@/components/Home/HomeExploreSection.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'

const { t } = useTranslation()
</script>

<template>
  <main>
    <!-- Full-width carousel — content constrained inside to 80% -->
    <HomeCarousel :slides="homeSlides" />

    <!-- Dark highlights strip directly below carousel -->
    <HomeHighlightsSection />

    <!-- Explore section — authenticated content hub -->
    <HomeExploreSection
      :actions="homeExploreActions"
      :section-title="t('dashboard.home.explore.sectionTitle')"
      :section-subtitle="t('dashboard.home.explore.sectionSubtitle')"
    />
  </main>
</template>
