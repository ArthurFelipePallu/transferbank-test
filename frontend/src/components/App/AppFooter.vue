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
            <div class="footer-section flex-center">
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
                <p>Email: {{ contactInformation.email }}</p>
                <p>Phone: {{ contactInformation.phone }}</p>
            </div>

        </div>

        <div class="footer-bottom">
            © {{ year }} SafeBank. All rights reserved.
        </div>
    </footer>
</template>

<style scoped>
.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer {
    background: var(--color-bg-section-darker);
    color: var(--color-text-footer);
    padding: 40px 20px 20px;
}

.footer-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
}

.footer-section h4 {
    margin-bottom: 10px;
}

.footer-section ul {
    list-style: none;
    padding: 0;
}

.footer-section li {
    margin-bottom: 6px;
}

.footer-section a {
    color: var(--color-input-border);
    text-decoration: none;
}

.footer-section a:hover {
    text-decoration: underline;
}

.logo {
    font-size: 20px;
    font-weight: bold;
}

.footer-bottom {
    margin-top: 30px;
    border-top: 1px solid var(--color-primary-teal);
    padding-top: 10px;
    text-align: center;
    font-size: 14px;
}
</style>