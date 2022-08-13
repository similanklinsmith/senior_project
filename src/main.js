import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from 'firebase/app'
const firebaseConfig = {
  apiKey: "AIzaSyCo-1tRO760FU8sT75cCmPT4Ev5K0Dv6jo",
  authDomain: "momento-login.firebaseapp.com",
  projectId: "momento-login",
  storageBucket: "momento-login.appspot.com",
  messagingSenderId: "1074886318514",
  appId: "1:1074886318514:web:460d96c875c0e47bbbacab",
  measurementId: "G-799B0JZLSE"
};
initializeApp(firebaseConfig);
import store from "./store";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import LitepieDatepicker from 'litepie-datepicker';
import axios from 'axios'
import VueAxios from 'vue-axios'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import "../public/general.scss";
import './index.css'
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon).use(store).use(VueAxios, axios).use(router).use(LitepieDatepicker).use(LottiePlayer).mount("#app");
