//APP Core
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./config/pinia";

//APP Core styles
import "./assets/styles/tailwind.css";

//Import plugins
import useVueQueryPlugin from "./config/vueQuery";
import useToastPlugin from "./config/toast";
import useMomentTimezonePlugin from "./config/momentTimezone";

//Directives
import clickOutside from "./directives/clickOutside.js";

const app = createApp(App);

//Use plugins
useVueQueryPlugin(app);
useToastPlugin(app);
useMomentTimezonePlugin(app);

app.use(router);
app.use(pinia);
app.directive("click-outside", clickOutside);

app.mount("#app");
