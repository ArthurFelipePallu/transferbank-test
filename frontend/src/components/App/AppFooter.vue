<script setup lang="ts">
import AppBrandLogo from './AppBrandLogo.vue';
const year = new Date().getFullYear()

const servicesLinks = [
    {
        name: 'accounts',
        Title: 'Accounts'
    },
    {
        name: 'transfers',
        Title: 'Transfers'
    },
    {
        name: 'loans',
        Title: 'Loans'
    },
    {
        name: 'investments',
        Title: 'Investments'
    },
]
const supportLinks = [
    {
        name: 'help-center',
        Title: 'Help Center'
    },
    {
        name: 'security',
        Title: 'Security'
    },
    {
        name: 'report-fraud',
        Title: 'Report Fraud'
    },
    {
        name: 'contact-us',
        Title: 'Contact Us'
    },
]

const contactInformation = {
    email: "support@mediteranian.com",
    phone: "+1 234 567 890"
}
</script>

<template>
    <footer class="footer">
        <div class="footer-container">

            <!-- Bank Info -->
            <div class="footer-section">
                <AppBrandLogo />
                <p>Your trusted digital banking partner.</p>
            </div>

            <!-- Navigation -->
            <div class="footer-section">
                <h4>Services</h4>
                <ul>
                    <li v-for="service in servicesLinks" :key="service.name">
                        <RouterLink :to="{ name: service.name }">{{ service.Title }}</RouterLink>
                    </li>
                </ul>
            </div>

            <!-- Help -->
            <div class="footer-section">
                <h4>Support</h4>
                <ul>
                    <li v-for="support in supportLinks" :key="support.name">
                        <RouterLink :to="{ name: support.name }">{{ support.Title }}</RouterLink>
                    </li>
                </ul>
            </div>

            <!-- Contact -->
            <div class="footer-section">
                <h4>Contact</h4>
                <p>Email: <span>{{ contactInformation.email }}</span></p>
                <p>Phone: <span>{{ contactInformation.phone }}</span></p>
            </div>

        </div>

        <div class="footer-bottom">
            © {{ year }} SafeBank. All rights reserved.
        </div>
    </footer>
</template>

<style scoped>
.footer-section,
.footer-bottom {
    user-select: none;
}

span {
    user-select: text;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer {
    background: var(--color-bg-section-darker);
    color: var(--color-text-footer);
    padding: 2rem 1rem 1.25rem;
}

.footer-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.75rem;
    max-width: var(--app-max-container-width);
    margin: 0 auto;
}

.footer-section h4 {
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
}

.footer-section p {
    font-size: 0.85rem;
    line-height: 1.6;
}

.footer-section ul {
    list-style: none;
    padding: 0;
}

.footer-section li {
    margin-bottom: 0.5rem;
}

.footer-section a {
    color: var(--color-input-border);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.2s ease;
}

.footer-section a:hover {
    color: var(--color-white);
    text-decoration: underline;
}

.logo {
    font-size: 1.1rem;
    font-weight: bold;
}

.footer-bottom {
    margin-top: 2rem;
    border-top: 1px solid var(--color-primary-teal);
    padding-top: 1rem;
    text-align: center;
    font-size: 0.8rem;
    max-width: var(--app-max-container-width);
    margin-left: auto;
    margin-right: auto;
}

@media (min-width: 640px) {
    .footer {
        padding: 2.5rem 1.5rem 1.5rem;
    }

    .footer-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }

    .footer-section h4 {
        font-size: 1rem;
    }

    .footer-section p,
    .footer-section a {
        font-size: 0.9rem;
    }

    .footer-bottom {
        font-size: 0.85rem;
    }
}

@media (min-width: 1024px) {
    .footer {
        padding: 2.5rem 2rem 1.25rem;
    }

    .footer-container {
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
    }

    .logo {
        font-size: 1.25rem;
    }
}
</style>