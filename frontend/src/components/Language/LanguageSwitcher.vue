<script setup lang="ts">
import { ref } from 'vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { SUPPORTED_LOCALES, LOCALE_INFO } from '@/domain/i18n/types/Locale'
import type { Locale } from '@/domain/i18n/types/Locale'

const { currentLocale, setLocale } = useTranslation()
const isOpen = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const open = () => {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  isOpen.value = true
}

const scheduleClose = () => {
  closeTimer = setTimeout(() => { isOpen.value = false; closeTimer = null }, 150)
}

const changeLocale = (locale: Locale) => {
  setLocale(locale)
  isOpen.value = false
  window.location.reload()
}
</script>

<template>
  <div class="language-switcher" @mouseenter="open" @mouseleave="scheduleClose">
    <button
      class="language-button"
      :aria-expanded="isOpen"
      :aria-label="`Current language: ${LOCALE_INFO[currentLocale].name}`"
      @click="isOpen = !isOpen"
    >
      <BaseLucideIcon name="Globe" :size="16" aria-hidden="true" />
      <span class="lang-abbr">{{ LOCALE_INFO[currentLocale].abbr }}</span>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="language-dropdown"
        role="listbox"
        :aria-label="'Select language'"
        @mouseenter="open"
        @mouseleave="scheduleClose"
      >
        <button
          v-for="locale in SUPPORTED_LOCALES"
          :key="locale"
          class="language-option"
          :class="{ active: locale === currentLocale }"
          role="option"
          :aria-selected="locale === currentLocale"
          @click="changeLocale(locale)"
        >
          <span class="option-abbr">{{ LOCALE_INFO[locale].abbr }}</span>
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
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: 1px solid var(--color-white-alpha-25);
  border-radius: var(--border-radius-md);
  color: var(--color-white);
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  min-height: 2.5rem;
  font-size: var(--font-size-sm);
}

.language-button:hover,
.language-button[aria-expanded="true"] {
  background: var(--color-white-alpha-12);
  border-color: var(--color-white-alpha-40);
}

.lang-flag {
  font-size: 1.1rem;
  line-height: 1;
  vertical-align: middle;
  flex-shrink: 0;
}

.lang-abbr {
  font-size: var(--font-size-sm);
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1;
  vertical-align: middle;
}

/* Dropdown */
.language-dropdown {
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  min-width: 170px;
  padding: var(--spacing-xs);
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  border: 1px solid var(--color-white-alpha-20);
  border-radius: var(--border-radius-md);
  box-shadow: 0 8px 24px var(--color-black-alpha-25);
  z-index: var(--z-dropdown);
}

/* Bridge gap so mouse can travel without triggering close */
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
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color 0.15s ease;
  text-align: left;
  color: var(--color-white-alpha-85);
  min-height: unset;
}

.language-option:hover  { background: var(--color-white-alpha-15); color: var(--color-white); }
.language-option.active { background: var(--color-white-alpha-20); color: var(--color-white); }

.option-flag {
  font-size: 1.1rem;
  line-height: 1;
  vertical-align: middle;
  flex-shrink: 0;
}

.option-abbr {
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.04em;
  min-width: 2.5rem;
  vertical-align: middle;
}

.option-name {
  font-size: var(--font-size-sm);
  font-weight: 400;
  opacity: 0.8;
  vertical-align: middle;
}

.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from,  .dropdown-leave-to      { opacity: 0; transform: translateY(-6px); }
</style>
