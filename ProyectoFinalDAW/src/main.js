import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "@/assets/style.css";
const app = createApp(App);

app.use(createPinia());
app.use(router);

const authStore = useAuthStore()
authStore.inicializar()

const store = useDataStore()
store.recargarDatosUsuario()

app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
  position: "top-right",
  timeout: 4000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
});

app.mount("#app");
