<script setup lang="ts">
import { ref } from 'vue'
import { Globe } from 'lucide-vue-next'
import { useTranslation } from '@/composables/useTranslation'
import { SUPPORTED_LOCALES, LOCALE_INFO } from '@/domain/i18n/types/Locale'
import type { Locale } from '@/domain/i18n/types/Locale'

const { currentLocale, setLocale } = useTranslation()
const isOpen = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const open = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  isOpen.value = true
}

const scheduleClose = () => {
  closeTimer = setTimeout(() => {
    isOpen.value = false
    closeTimer = null
  }, 150)
}

const changeLocale = (locale: Locale) => {
  setLocale(locale)
  isOpen.value = false
  window.location.reload()
}
</script>

<template>
  <div
    class="language-switcher"
    @mouseenter="open"
    @mouseleave="scheduleClose"
  >
    <button
      class="language-button"
      :aria-expanded="isOpen"
      :aria-label="`Current language: ${LOCALE_INFO[currentLocale].name}`"
      @click="isOpen = !isOpen"
    >
      <Globe :size="18" />
      <span class="language-flag">{{ LOCALE_INFO[currentLocale].flag }}</span>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="language-dropdown"
        @mouseenter="open"
        @mouseleave="scheduleClose"
      >
        <button
          v-for="locale in SUPPORTED_LOCALES"
          :key="locale"
          class="language-option"
          :class="{ active: locale === currentLocale }"
          @click="changeLocale(locale)"
        >
          <span class="option-flag">{{ LOCALE_INFO[locale].flag }}</span>
          <span class="option-name">{{ LOCALE_INFO[locale].name }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid var(--color-white-alpha-25);
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-button:hover,
.language-button[aria-expanded="true"] {
  background: var(--color-white-alpha-12);
  border-color: var(--color-white-alpha-40);
}

.language-flag {
  font-size: 1.1rem;
  line-height: 1;
}

/* Invisible bridge between button and dropdown so mouse can travel without triggering close */
.language-dropdown {
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  min-width: 160px;
  padding: 0.375rem;
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  border: 1px solid var(--color-white-alpha-20);
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px var(--color-black-alpha-25);
  z-index: 1000;
}

/* Pseudo-element bridge fills the gap between button bottom and dropdown top */
.language-dropdown::before {
  content: '';
  position: absolute;
  top: -0.5rem;
  left: 0;
  right: 0;
  height: 0.5rem;
}

.language-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  text-align: left;
  color: var(--color-white-alpha-85);
}

.language-option:hover {
  background: var(--color-white-alpha-15);
  color: white;
}

.language-option.active {
  background: var(--color-white-alpha-20);
  color: white;
}

.option-flag {
  font-size: 1.1rem;
  line-height: 1;
}

.option-name {
  font-size: 0.875rem;
  font-weight: 500;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
