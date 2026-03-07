<script setup lang="ts">
import AppLogo from './AppLogo.vue';

</script>


<template>
    <div class="brand">
        <AppLogo />
        <span class="brand-name">Mediteranian Bank</span>
    </div>
</template>


<style scoped>
.brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.brand-name {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.03em;
}

@media (min-width: 640px) {
    .brand {
        gap: 0.6rem;
    }

    .brand-name {
        font-size: 0.95rem;
    }
}

@media (min-width: 1024px) {
    .brand-name {
        font-size: 1rem;
    }
}
</style>