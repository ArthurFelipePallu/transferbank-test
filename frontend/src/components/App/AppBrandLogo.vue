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
    gap: 0.6rem;
}

.brand-name {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.03em;
}
</style>