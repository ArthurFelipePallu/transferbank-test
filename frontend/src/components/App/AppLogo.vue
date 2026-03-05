<script setup lang="ts">


</script>


<template>
    <div class="brand-logo">
        <img src="/bank-logo.png" alt="Mediteranian Bank logo" class="brand-logo-image" />
    </div>
</template>


<style scoped>
.brand-logo {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-button-primary);
}

.brand-logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>