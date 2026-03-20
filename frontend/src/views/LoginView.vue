<script setup lang="ts">
import ColoredContainer from '@/components/Layout/ColoredContainer.vue'
import LoginCard from '@/components/Auth/LoginCard.vue'
import CurrencyInfoPanel from '@/components/Currency/CurrencyInfoPanel.vue'
</script>

<template>
    <main class="login-page min-vh-100 d-flex align-items-center justify-content-center py-4 px-3">
        <ColoredContainer :background-color="'var(--color-bg-section-dark)'" :padding="'1.75rem 2.5rem'">
            <div class="login-layout">
                <!-- Login Form Column -->
                <div class="login-form-wrapper">
                    <LoginCard />
                </div>

                <!-- Currency Info Panel Column -->
                <div class="currency-panel-wrapper">
                    <CurrencyInfoPanel />
                </div>
            </div>
        </ColoredContainer>
    </main>
</template>

<style scoped>
.login-page {
    background: var(--color-surface);
}

/* Custom flexbox layout - components side by side with natural widths */
.login-layout {
    display: flex;
    gap: 1.5rem;
    align-items: stretch;
    max-width: 1400px; /* Constrain maximum width */
    margin: 0 auto; /* Center the layout */
}

/* Login form: natural width with constraints */
.login-form-wrapper {
    flex: 0 1 auto;
    max-width: 450px;
}

/* Currency panel: takes remaining space with constraints */
.currency-panel-wrapper {
    flex: 1 1 auto;
    max-width: 550px;
}

/* Mobile: Stack vertically, hide currency panel */
@media (max-width: 991px) {
    .login-layout {
        flex-direction: column;
        max-width: 100%;
    }
    
    .login-form-wrapper {
        flex: 1 1 100%;
        max-width: 100%;
    }
    
    .currency-panel-wrapper {
        display: none;
    }
}
</style>
