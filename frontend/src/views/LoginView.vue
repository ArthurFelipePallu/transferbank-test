<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue';
import ColoredContainer from '@/components/ColoredContainer.vue';
</script>

<template>
    <main class="login-page flex-center">

        <ColoredContainer :background-color="'var(--color-bg-section-dark)'" :padding="'1.75rem 2.5rem'">
            <section class="login-card">
                <header class="card-header flex-center">
                    <ColoredContainer :background-color="'var(--color-accent-teal-1)'" :padding="'1rem'">
                        <BaseLucideIcon name="Lock" :size="20" :stroke_width="4"
                            color="var(--color-primary-teal-alt)" />
                    </ColoredContainer>
                    <h1>Welcome Back</h1>
                    <p>Please enter your details to sign in.</p>
                </header>
                <h1>Here comes the fogin form</h1>
                <h2>enter</h2>
                <h3>Or continue with</h3>
                <div>
                    <h4>google button</h4>
                    <h4>apple button</h4>
                </div>
                <h3>Don't have an account? Sign up</h3>
            </section>
        </ColoredContainer>
        <!-- <section class="card">
            <header class="card-header">
                <h1>Business Onboarding</h1>
                <p>Register your company to operate with crypto on web and mobile.</p>
            </header>

            <OnboardingForm @submit="onSubmit" />
        </section> -->
    </main>
</template>

<style scoped>
.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;

}


.login-page {
    max-width: var(--app-max-width);
    min-height: 100vh;
    padding: 1.5rem;
    color: var(--color-white);
}

.login-card {
    width: var(--app-max-login-container-width);
    max-width: var(--app-max-container-width);
    background: var(--color-white);
    border-radius: 1.25rem;
    box-shadow: var(--shadow-card-weak);
    padding: 1.75rem;
    border: 1px solid var(--color-surface-border);
}

.card-header {
    margin-bottom: 1.75rem;
    flex-direction: column;
}

.card-header h1 {
    font-size: 1.6rem;
    margin-bottom: 0.4rem;
    color: var(--color-text-main);
}

.card-header p {
    font-size: 0.9rem;
    color: var(--color-text-muted);
}

@media (min-width: 720px) {
    .card {
        padding: 2.25rem 2.5rem;
    }

    .card-header h1 {
        font-size: 1.9rem;
    }
}
</style>
