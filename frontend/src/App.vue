<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/App/AppHeader.vue';
import AppFooter from './components/App/AppFooter.vue';
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <RouterView />
    <AppFooter />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
