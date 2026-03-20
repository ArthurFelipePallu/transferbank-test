<script setup lang="ts">
import { useCarousel } from '@/composables/ui/useCarousel'
import type { HomeSlide } from '@/domain/home/types/HomeSlide'
import { useRouter } from 'vue-router'
import CarouselSlide from './CarouselSlide.vue'
import CarouselArrows from './CarouselArrows.vue'
import CarouselDots from './CarouselDots.vue'

const props = defineProps<{ slides: HomeSlide[] }>()

const router = useRouter()
const { current, prev, next, goTo, pause, resume } = useCarousel(props.slides.length)

const handleCta = (slide: HomeSlide) => {
  if (slide.cta) router.push({ name: slide.cta.route })
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}
</script>

<template>
  <section
    class="home-carousel"
    role="region"
    aria-label="Promotions and announcements"
    tabindex="0"
    @mouseenter="pause"
    @mouseleave="resume"
    @keydown="handleKeydown"
  >
    <!-- Stacked slides — all in DOM, opacity drives crossfade (no blink) -->
    <div class="home-carousel__track">
      <CarouselSlide
        v-for="(slide, index) in slides"
        :key="slide.id"
        :slide="slide"
        :active="current === index"
        @cta="handleCta(slide)"
      />
    </div>

    <!-- Controls -->
    <CarouselArrows @prev="prev" @next="next" />

    <div class="home-carousel__dots-wrap">
      <CarouselDots :count="slides.length" :current="current" @go="goTo" />
    </div>
  </section>
</template>

<style scoped>
.home-carousel {
  position: relative;
  width: 100%;
  min-height: 420px;
  overflow: hidden;
  outline: none;
  background: var(--color-primary-bg-mid); /* visible while images load */
}

@media (min-width: 768px) {
  .home-carousel { min-height: 520px; }
}

/* Track fills the carousel height so absolute slides have a reference */
.home-carousel__track {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
}

.home-carousel__dots-wrap {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}
</style>
