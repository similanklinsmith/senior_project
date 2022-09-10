/* eslint-disable */
import axios from "axios";
import VueCookies from "vue-cookies";
import router from "@/router";
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_PATH,
});

instance.interceptors.request.use(async (config) => {
  config.headers = {
    Authorization: `Bearer ${VueCookies.get("idToken")}`,
  };
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { message } = error;
    let refreshToken = VueCookies.get("refreshToken");
    if (error.response.status == 401) {
      console.log("RUN");
      let refreshTokenUrl = `https://securetoken.googleapis.com/v1/token?key=${process.env.VUE_APP_API_KEY}`;
      let token = await axios.post(refreshTokenUrl, {
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      });
      let { data } = token;
      console.log("🚀 ~ file: axios.js ~ line 35 ~ token", token);
      VueCookies.set("idToken", data.id_token);
      localStorage.setItem("user", data.id_token);
    }
    if (error.response.status == 404) {
      router.push({ name: "NotFound" });
    }
  }
);

export const customAxios = {
  instance,
};
