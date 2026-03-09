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
