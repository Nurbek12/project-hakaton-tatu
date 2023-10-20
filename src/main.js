import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import i18n from './language/i18n'
import '@mdi/font/css/materialdesignicons.min.css'

createApp(App)
    .use(vuetify)
    .use(router)
    .use(store)
    .use(i18n)
    .mount('#app')