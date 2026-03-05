<script setup lang="ts">
import { iconMap, type IconName } from '@/utils/LucideIconMap';
import { computed } from 'vue';

const props = defineProps<{
    name: IconName,
    size?: number,
    stroke_width?: number,
}>()

const Icon = computed(() => iconMap[props.name])
</script>


<template>
    <component :is="Icon" :size='size ?? 20' stroke="currentColor" :stroke-width="stroke_width ?? 2" class="class" />
</template>

<style scoped></style>