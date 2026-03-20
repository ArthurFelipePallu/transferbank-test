// Bootstrap 5 with custom configuration
import './assets/bootstrap-custom.scss'

// Custom styles (loaded after Bootstrap to allow overrides)
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createPersistencePlugin } from './stores/plugins/persistencePlugin'

const app = createApp(App)

const pinia = createPinia()
pinia.use(createPersistencePlugin())

app.use(pinia)
app.use(router)

app.mount('#app')
