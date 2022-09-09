/* eslint-disable */
import axios from "axios";
import VueCookies from "vue-cookies";
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_PATH,
});

instance.interceptors.request.use(async (config) => {
  config.headers = {
    Authorization: `Bearer ${VueCookies.get("idToken")}`,
  };
  // console.log(config);
  return config;
});

instance.interceptors.response.use(
  (response) => {
    // console.log(response);
    // console.log("RESPONSE");
    return response;
  },
  async (error) => {
    // let { message, code } = error;
    let { message } = error;
    console.log(error.response.status); // 401
    console.log(error.response.statusText); // Unauthorized
    let refreshToken = VueCookies.get("refreshToken");
    if (error.response.status == 401) {
      // if (
      //   message == "TOKEN EXPIRED" ||
      //   error.response.statusText == "Unauthorized"
      // ) {
        console.log("RUN");
        let refreshTokenUrl = `https://securetoken.googleapis.com/v1/token?key=${process.env.VUE_APP_API_KEY}`;
        let token = await axios.post(refreshTokenUrl, {
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        });
        let { data } = token;
        console.log("🚀 ~ file: axios.js ~ line 35 ~ token", token);
        VueCookies.set("idToken", data.id_token);
      // }
    }
  }
);

export const customAxios = {
  instance,
};
