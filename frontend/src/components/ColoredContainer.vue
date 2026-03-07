<script setup lang="ts">
defineProps<{
    backgroundColor?: string
    padding?: string
}>()
</script>

<template>
    <section class="colored-container" :style="{ backgroundColor, padding }">
        <slot />
    </section>
</template>

<style scoped>
.colored-container {
    display: inline-grid;
    place-items: center;

    width: fit-content;

    border-radius: 1rem;
    border: 1px solid var(--color-surface-border);
}

@media (min-width: 640px) {
    .colored-container {
        border-radius: 1.25rem;
    }
}
</style>