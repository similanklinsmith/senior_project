import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from 'firebase/app'
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};
initializeApp(firebaseConfig);
import store from "./store";
import LitepieDatepicker from 'litepie-datepicker';
import axios from 'axios'
import VueAxios from 'vue-axios'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import "../public/general.scss";
import './index.css'
const app = createApp(App)
app.use(store).use(VueAxios, axios).use(router).use(LitepieDatepicker).use(LottiePlayer).mount("#app");
