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

const toastOptions = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false,
    transition: "Vue-Toastification__fade",
    maxToasts: 20,
    newestOnTop: true,
};

const app = createApp(App)

app.use(Toast, toastOptions);
addIcons(FaUserAlt, RiLoader4Fill, IoArrowBackSharp, RiLogoutBoxFill, RiCloseLine, RiSearchLine);
app.component("v-icon", OhVueIcon);
app.use(createPinia())
app.use(router)

app.mount('#app')