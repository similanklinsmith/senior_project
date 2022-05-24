import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import {library} from '@fortawesome/fontawesome-svg-core'
// import {fas} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import LitepieDatepicker from 'litepie-datepicker';
import axios from 'axios'
import VueAxios from 'vue-axios'
// library.add(fas);
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import "../public/general.scss";
import './index.css'
createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(store).use(VueAxios, axios).use(router).use(LitepieDatepicker).use(LottiePlayer).mount("#app");
