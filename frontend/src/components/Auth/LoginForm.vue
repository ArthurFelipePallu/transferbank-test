<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import FormInputField from '@/components/Form/FormInputField.vue'
import { loginSchema, type LoginFormValues } from '@/domain/onboarding/login.schema'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUiStore } from '@/stores/useUiStore'
import { useTranslation } from '@/composables/useTranslation'
import { authPageLinks } from '@/config/navigation'
import { RouteName } from '@/domain/navigation/types/RouteNames'

const props = withDefaults(
    defineProps<{
        submitLabel?: string
    }>(),
    {
        submitLabel: undefined,
    },
)

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const { t } = useTranslation()

const { handleSubmit, meta } = useForm<LoginFormValues>({
    validationSchema: loginSchema,
    initialValues: {
        email: '',
        password: '',
    },
})

const submit = handleSubmit(async (values) => {
    try {
        uiStore.startLoading(t('auth.signingIn'))
        
        const success = await authStore.login(values.email, values.password)
        
        if (success) {
            uiStore.showSuccess(t('auth.welcomeBack'))
            // Check if there's a redirect query parameter
            const redirect = router.currentRoute.value.query.redirect as string
            router.push(redirect || { name: RouteName.Dashboard })
        } else {
            uiStore.showError(authStore.error || t('auth.loginFailed'))
        }
    } catch (error) {
        console.error('Login error:', error)
        uiStore.showError(t('errors.unexpectedError'))
    } finally {
        uiStore.stopLoading()
    }
})
</script>

<template>
    <form class="login-form" @submit.prevent="submit">
        <!-- Email Field -->
        <div class="mb-3">
            <FormInputField 
                name="email" 
                :label="t('auth.email')" 
                type="email" 
                placeholder="you@company.com" 
                autocomplete="email"
            >
                <template #icon>
                    <BaseLucideIcon name="Mail" :size="18" />
                </template>
            </FormInputField>
        </div>

        <!-- Password Field with Forgot Password Link -->
        <div class="mb-3">
            <FormInputField 
                name="password" 
                :label="t('auth.password')" 
                type="password" 
                autocomplete="current-password"
                placeholder="••••••••"
            >
                <template #icon>
                    <BaseLucideIcon name="KeyRound" :size="18" />
                </template>
            </FormInputField>
            
            <!-- Forgot Password Link - Right below password field, aligned right -->
            <div class="text-end mt-2">
                <RouterLink 
                    class="small fw-semibold text-decoration-none forgot-password" 
                    :to="{ name: authPageLinks.forgotPassword }"
                >
                    {{ t('auth.forgotPassword') }}
                </RouterLink>
            </div>
        </div>
        
        <!-- Submit Button -->
        <button 
            class="btn btn-primary w-100 py-3 fw-semibold submit-btn" 
            type="submit" 
            :disabled="!meta.valid"
        >
            {{ props.submitLabel || t('auth.loginSubmit') }}
        </button>
    </form>
</template>

<style scoped>
.login-form {
    width: 100%;
}

.forgot-password {
    color: var(--color-primary-teal);
    transition: all 0.15s ease;
    font-size: 0.875rem;
}

.forgot-password:hover {
    color: var(--color-accent-teal-1);
}

.submit-btn {
    background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
    border: none;
    border-radius: 0.5rem;
    box-shadow: var(--shadow-button-primary);
    transition: all 0.2s ease;
    font-size: 1rem;
    letter-spacing: 0.025em;
}

.submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
}

.submit-btn:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px var(--color-teal-alpha-30);
}

.submit-btn:not(:disabled):active {
    transform: translateY(0);
    box-shadow: var(--shadow-button-primary-active);
}
</style>
