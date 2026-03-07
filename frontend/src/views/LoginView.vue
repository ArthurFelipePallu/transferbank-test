<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue';
import ColoredContainer from '@/components/ColoredContainer.vue';
import LoginForm from '@/components/Form/LoginForm.vue';
import DividerText from '@/components/DividerText.vue';
import SocialLoginButton from '@/components/Form/SocialLoginButton.vue';
import GoogleIcon from '@/components/icons/GoogleIcon.vue';
import { Apple } from 'lucide-vue-next';
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
                <LoginForm />

                <DividerText text="Or continue with" />
                <div>
                    <div class="social-login">
                        <SocialLoginButton label="Google">
                            <template #icon>
                                <GoogleIcon />
                            </template>
                        </SocialLoginButton>

                        <SocialLoginButton label="Apple">
                            <template #icon>
                                <Apple :size="18" />
                            </template>
                        </SocialLoginButton>
                    </div>
                </div>
                <h3>Don't have an account?
                    <span>
                        <RouterLink class="sign-up-link" :to="{ name: 'home' }">Sign Up</RouterLink>
                    </span>
                </h3>
            </section>
        </ColoredContainer>
    </main>
</template>

<style scoped>
.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

h1,
h3,
p {
    user-select: none;
}

h3 {
    text-align: center;
    font-size: 0.9rem;
    color: var(--color-text-muted);
}

.sign-up-link {
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    color: var(--color-accent-teal-1);

}

.login-page {
    max-width: var(--app-max-width);
    min-height: 100vh;
    padding: var(--spacing-page);
    color: var(--color-white);
}

.login-card {
    width: 100%;
    max-width: 420px;
    background: var(--color-surface);
    border-radius: 1rem;
    box-shadow: var(--shadow-card-weak);
    padding: var(--spacing-card);
    border: 1px solid var(--color-surface-border);

    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.card-header {
    margin-bottom: 1.25rem;
    flex-direction: column;
}

.card-header h1 {
    font-size: 1.4rem;
    margin-bottom: 0.4rem;
    color: var(--color-text-main);
}

.card-header p {
    font-size: 0.85rem;
    color: var(--color-text-muted);
}

.social-login {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

@media (min-width: 640px) {
    .login-card {
        border-radius: 1.25rem;
        max-width: 480px;
    }

    .card-header {
        margin-bottom: 1.75rem;
    }

    .card-header h1 {
        font-size: 1.6rem;
    }

    .card-header p {
        font-size: 0.9rem;
    }

    .social-login {
        flex-direction: row;
        gap: 1rem;
    }
}

@media (min-width: 1024px) {
    .login-card {
        max-width: 520px;
    }

    .card-header h1 {
        font-size: 1.9rem;
    }
}
</style>
