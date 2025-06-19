import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// v-icon
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { FaUserAlt, RiLoader4Fill, IoArrowBackSharp, RiLogoutBoxFill, RiCloseLine, RiSearchLine } from "oh-vue-icons/icons";

// toast
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

// tailwind import
import './style.css'

const app = createApp(App)

app.use(Toast)
addIcons(FaUserAlt, RiLoader4Fill, IoArrowBackSharp, RiLogoutBoxFill, RiCloseLine, RiSearchLine);
app.component("v-icon", OhVueIcon);
app.use(createPinia())
app.use(router)

app.mount('#app')