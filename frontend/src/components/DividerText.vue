<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        default: "Divider"
    },
    color: {
        type: String,
        default: "var(--color-text-muted)"
    }
})
</script>

<template>
    <div class="divider" :style="{ color: props.color }">
        <span class="line"> </span>

        <span class=" text">
            {{ props.text }}
        </span>

        <span class="line"></span>
    </div>
</template>

<style scoped>
.divider,
.line {
    user-select: none;
}

.divider {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.75rem;
}

.line {
    flex: 1;
    height: 1px;
    background: color-mix(in srgb, currentColor 20%, transparent);
    /* background: linear-gradient(to right,
            color-mix(in srgb, currentColor 25%, transparent),
            currentColor); */
}

/* .line:last-child {
    background: linear-gradient(to left,
            color-mix(in srgb, currentColor 25%, transparent),
            currentColor);
} */

.text {
    white-space: nowrap;
    font-size: 0.85rem;
    font-weight: 500;
}
</style>