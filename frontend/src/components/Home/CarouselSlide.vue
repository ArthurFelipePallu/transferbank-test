<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import type { HomeSlide } from '@/domain/home/types/HomeSlide'

defineProps<{
  slide: HomeSlide
  active: boolean
}>()

const emit = defineEmits<{ cta: [] }>()
const { t } = useTranslation()
</script>

<template>
  <!--
    All slides are always in the DOM, stacked via position:absolute.
    Opacity drives the crossfade — no gap between leaving and entering.
  -->
  <div
    class="carousel-slide"
    :class="{ 'carousel-slide--active': active }"
    :style="{
      backgroundImage: `url('${slide.imageUrl}'), ${slide.fallbackGradient}`,
    }"
    :aria-hidden="!active"
  >
    <!-- Readability overlay -->
    <div class="carousel-slide__overlay" />

    <!-- Text content — fades independently -->
    <div class="standard-container carousel-slide__content px-3 px-lg-0">
      <Transition name="slide-content">
        <div v-if="active" class="carousel-slide__inner">
          <p class="carousel-slide__eyebrow">{{ t(slide.eyebrowKey) }}</p>
          <h2 class="carousel-slide__title fw-bold text-white">{{ t(slide.titleKey) }}</h2>
          <p class="carousel-slide__desc">{{ t(slide.descriptionKey) }}</p>
          <button
            v-if="slide.cta"
            class="btn btn-light fw-semibold d-inline-flex align-items-center gap-2 carousel-slide__cta"
            type="button"
            @click="emit('cta')"
          >
            <BaseLucideIcon v-if="slide.cta.icon" :name="slide.cta.icon" :size="16" />
            {{ t(slide.cta.labelKey) }}
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.carousel-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.7s ease;
  pointer-events: none;
}

.carousel-slide--active {
  opacity: 1;
  pointer-events: auto;
}

.carousel-slide__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--color-black-alpha-72) 0%,
    var(--color-black-alpha-45) 55%,
    var(--color-black-alpha-10) 100%
  );
}

.carousel-slide__content {
  position: relative;
  z-index: 1;
  padding-top: var(--spacing-3xl);
  padding-bottom: var(--spacing-3xl);
}

.carousel-slide__inner {
  max-width: 560px;
}

.carousel-slide__eyebrow {
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent-teal-1);
  margin-bottom: var(--spacing-sm);
}

.carousel-slide__title {
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-md);
}

@media (min-width: 768px) {
  .carousel-slide__title { font-size: var(--font-size-3xl); }
}

.carousel-slide__desc {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-white-alpha-85);
  margin-bottom: var(--spacing-lg);
  max-width: 460px;
}

.carousel-slide__cta {
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.carousel-slide__cta:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-card-weak);
}

/* Content fade-up on enter */
.slide-content-enter-active {
  transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
}
.slide-content-leave-active {
  transition: opacity 0.2s ease;
}
.slide-content-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.slide-content-leave-to {
  opacity: 0;
}
</style>
