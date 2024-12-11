import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Подключение роутера

const app = createApp(App);
app.use(router); // Использование роутера
app.mount("#app");
