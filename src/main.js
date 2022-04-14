import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
library.add(fas);
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import "../public/general.scss";
createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(store).use(router).mount("#app");
