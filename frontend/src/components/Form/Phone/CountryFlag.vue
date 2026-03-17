<script setup lang="ts">
/**
 * CountryFlag Component - Presentation Layer
 * Displays a country flag icon using flag-icons library
 * Pure presentation component with no business logic
 */

interface Props {
  countryCode: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeClasses = {
  sm: 'flag-sm',
  md: 'flag-md',
  lg: 'flag-lg'
}
</script>

<template>
  <span 
    :class="['fi', `fi-${countryCode.toLowerCase()}`, sizeClasses[size]]"
    :title="countryCode.toUpperCase()"
    role="img"
    :aria-label="`${countryCode.toUpperCase()} flag`"
  />
</template>

<style scoped>
.fi {
  border-radius: 2px;
  box-shadow: 0 1px 3px var(--color-black-alpha-10);
  display: inline-block;
}

.flag-sm {
  font-size: 1rem;
}

.flag-md {
  font-size: 1.5rem;
}

.flag-lg {
  font-size: 2rem;
}
</style>
