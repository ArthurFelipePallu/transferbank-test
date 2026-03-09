<script setup lang="ts">
import { ref } from 'vue'
import { Globe } from 'lucide-vue-next'
import { useTranslation } from '@/composables/useTranslation'
import { SUPPORTED_LOCALES, LOCALE_INFO } from '@/domain/i18n/types/Locale'
import type { Locale } from '@/domain/i18n/types/Locale'

const { currentLocale, setLocale } = useTranslation()
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const changeLocale = (locale: Locale) => {
  setLocale(locale)
  closeDropdown()
  // Reload page to apply translations everywhere
  window.location.reload()
}
</script>

<template>
  <div class="language-switcher" @mouseleave="closeDropdown">
    <button 
      class="language-button" 
      @click="toggleDropdown"
      :aria-label="`Current language: ${LOCALE_INFO[currentLocale].name}`"
    >
      <Globe :size="20" />
      <span class="language-flag">{{ LOCALE_INFO[currentLocale].flag }}</span>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="language-dropdown">
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.language-flag {
  font-size: 1.25rem;
  line-height: 1;
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 150px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
}

.language-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: left;
}

.language-option:hover {
  background: var(--color-background-soft);
}

.language-option.active {
  background: var(--color-primary-teal);
  color: white;
}

.option-flag {
  font-size: 1.25rem;
  line-height: 1;
}

.option-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
}

.language-option.active .option-name {
  color: white;
}

/* Dropdown Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
