import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { router } from './common/router'
import axios from "axios"
import { createDiscreteApi } from "naive-ui"
import { AdminStore } from "./stores/AdminStore"
import { Plugin } from 'vue-responsive-video-background-player'
import V3Scroll from "v3-scroll";
import "v3-scroll/dist/library.mjs.css";
import { VueMasonryPlugin } from 'vue-masonry';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
  })

axios.defaults.baseURL =/* "http://103.149.26.159/" */   "http://localhost:80/"  

const { message, notification, dialog, modal } = createDiscreteApi(['message', 'dialog', 'notification', 'modal'],)

const app = createApp(App)

app.provide("axios",axios)
app.provide("message",message)
app.provide("notification",notification)
app.provide("dialog",dialog)
app.provide("server_url", axios.defaults.baseURL)
app.provide("modal",modal)

app.use(router)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

const adminstore = AdminStore()
axios.interceptors.request.use((config) =>{
    if(adminstore.adminInfo.data != null) config.headers.token = adminstore.adminInfo.data.token
    return config
})

app.use(V3Scroll)
app.use(Plugin)
app.use(vuetify)
app.use(VueMasonryPlugin)
app.use(CkeditorPlugin)

app.mount('#app')
