<template>
  <div class="sign-in-screen">
    <div class="header">
      <div class="logo-text">
        <img src="@/assets/images/logo_text.png" alt="logo momento">
      </div>
      <div class="language" @click="changeLanguage">
        <div class="language-text">
          <div class="bold-small-text" v-if="lang == 'th'">
            <span :style="lang == 'th' ? { color: '#23106D' } : {}">{{
              lang.toUpperCase()
            }}</span>
            | EN
          </div>
          <div class="bold-small-text" v-else>
            <span :style="lang == 'en' ? { color: '#23106D' } : {}">{{
              lang.toUpperCase()
            }}</span>
            | TH
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="first-section">
        <div class="display-text">
          <div class="big-header-text first">Let’s make</div>
          <div class="big-header-text second">
            your life <span class="violet">easier</span
            ><span class="yellow">.</span>
          </div>
        </div>
        <lottie-player
          class="lottie"
          src="https://assets3.lottiefiles.com/packages/lf20_7z8wtyb0.json"
          background="transparent"
          speed="1"
          loop
          autoplay
        ></lottie-player>
      </div>
      <div class="second-section">
        <div class="first-row">
          <div class="header-text">{{text['authentication']['welcome']}} <span>MOMENT<span :style="{color: '#FFCB57'}">O</span><span :style="{color: '#DBD2FF'}">.</span></span></div>
          <div class="thin-content-text before-signin">
            {{text['authentication']['caption']}}
          </div>
        </div>
        <BaseButton
          buttonType="outlined-button"
          :btnText="text['authentication']['signInMicrosoft']"
          textColor="#7452FF"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          @onClick="signInWithMicrosoft"
        >
          <template v-slot:before-icon>
            <i class="fa-brands fa-windows"></i>
          </template>
        </BaseButton>
        <div class="small-text information">
          {{text['authentication']['information']}} <span><a href="https://cc.kmutt.ac.th/catalog.html" target="_blank">{{text['authentication']['contact']}}</a></span>
        </div>
      </div>
    </div>
    <BasePopup
      v-if="isShowPopup"
      @closeModal="isShowPopup = false"
      :image="require(`@/assets/decorations/delete_executive.png`)"
    >
      <template v-slot:popupContent>
        {{ text["authentication"]["error"] }}
        [Error: {{ statusCode }}]
      </template>
      <template v-slot:buttons>
        <BaseButton
          buttonType="common-button"
          :btnText="text['authentication']['close']"
          textColor="white"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="isShowPopup = false"
        >
        </BaseButton>
      </template>
    </BasePopup>
  </div>
</template>

<script>
import axios from "axios";
import { getAuth, signInWithPopup, OAuthProvider } from "firebase/auth";
import BaseButton from "@/components/UI/BaseButton.vue";
import BasePopup from "@/components/UI/BasePopup.vue";
export default {
  components: { BaseButton, BasePopup },
  name: "SignInView",
  data() {
    return {
      text: null,
      lang: null,
      isSignIn: true,
      isShowPopup: false,
      form: {
        email: "",
        password: "",
      },
      errors: {},
      notFound: "",
      statusCode: "",
    };
  },
  methods: {
    changeLanguage() {
      if (this.lang == "en") {
        this.$cookies.set("lang", "th");
      } else {
        this.$cookies.set("lang", "en");
      }
      window.location.reload();
    },
    signInWithMicrosoft() {
      const provider = new OAuthProvider("microsoft.com");
      const auth = getAuth();
      provider.addScope("openid");
      provider.addScope("offline_access");
      provider.addScope("profile");
      provider.setCustomParameters({
        prompt: "consent",
        login_hint: "user@firstadd.onmicrosoft.com",
      });
      signInWithPopup(auth, provider)
        .then((result) => {
          const BASE_URL = process.env.VUE_APP_API_PATH;
          let jsonEmail = {
            email: result.user.email,
          };
          axios
            .post(`${BASE_URL}/filterPermission`, jsonEmail)
            .then(() => {
              const credential = OAuthProvider.credentialFromResult(result);
              const accessToken = credential.accessToken;
              localStorage.setItem("accessToken", accessToken);
              this.$cookies.set(
                "refreshToken",
                result.user.stsTokenManager.refreshToken
              );
              getAuth()
                .currentUser.getIdToken()
                .then((result) => {
                  localStorage.setItem("user", result);
                  this.$cookies.set("idToken", result);
                });
              this.$router.push("/");
            })
            .catch((err) => {
              if (err.response.status == 401) {
                this.isShowPopup = true;
                this.statusCode = "You do NOT have authorization to access";
                return;
              } else {
                this.isShowPopup = true;
                this.statusCode = err;
              }
            });
        })
        .catch((error) => {
          console.log(error);
          this.isShowPopup = true;
          this.statusCode = error;
        });
    },
  },
  beforeMount() {
    if (this.$cookies.get("lang")) {
      this.lang = this.$cookies.get("lang");
    } else {
      this.lang = "en";
    }
    this.text = require(`@/assets/langs/${this.lang}.json`);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.required {color: $error;margin-left: 0.2rem;font-size: 1.4rem !important;}
.sign-in-screen {width: 100%;height: 100vh;background-color: var(--bgHeaderComp);display: flex;flex-direction: column;position: fixed;overflow-y: scroll;.before-signin,.information {line-height: 1.6 !important;}.information {background-color: $primaryGrey;padding: 2rem;border-radius: 1rem;span {font-weight: 600;color: $primaryViolet;text-decoration: underline;cursor: pointer;transition: 0.2s all ease-in-out;&:hover {color: $darkViolet;}}}.header {display: flex;justify-content: space-between;align-items: center;padding: 4.8rem 7.2rem;.language {position: relative;cursor: pointer;padding: 0 1rem;height: 3.5rem;background-color: $fadedViolet;border-radius: 1rem;transition: 0.2s all ease-in-out;.language-text {display: flex;justify-content: space-evenly;align-items: center;height: 100%;color: $white;}&:hover {background-color: $highlightViolet;}}.logo-text {font-size: 3.6rem;font-weight: 600;color: var(--headerSignin);img {height: 5.2rem;}}}.body {width: 100%;height: fit-content;display: grid;grid-template-columns: 1.25fr 0.75fr;padding: 0 7.2rem;.first-section {display: flex;justify-content: center;animation-name: appearsBottom;animation-duration: 0.75s;animation-iteration-count: 1;.display-text {display: flex;flex-direction: column;row-gap: 1.6rem;& {transform: translateY(3rem);position: absolute;z-index: 1;}.first {transform: translateX(-10rem);color: var(--headerSignin);}.second {.violet {color: $primaryViolet;}.yellow {color: $yellow;}}}.lottie {width: 60rem;height: 60rem;}}.second-section {display: flex;flex-direction: column;row-gap: 2.5rem;padding: 4.8rem 2rem;width: 90%;animation-name: appearsBottom;animation-duration: 0.85s;animation-iteration-count: 1;.first-row {display: flex;flex-direction: column;row-gap: 0.5rem;margin-bottom: 3.6rem;.thin-content-text {color: $fakeDark;}.header-text {span {color: $primaryViolet;}}}.sign-in-form {display: flex;flex-direction: column;row-gap: 2.5rem;}}}}
@media (max-width: 70em) {.sign-in-screen {.body {grid-template-columns: 1.1fr 0.9fr;.first-section {.lottie {width: 45rem;height: 45rem;}}.second-section {.or::before,.or::after {letter-spacing: -10%;content: "______";}}}}}
@media (max-width: 63.5em) {.sign-in-screen {.body {grid-template-columns: 1fr 1fr;.first-section {.lottie {width: 40rem;height: 40rem;margin-top: 5rem;}.display-text {.first {transform: translateX(-5rem);}}}.second-section {width: 100%;padding: 4.8rem 0rem;}}}}
@media (max-width: 48em) {.sign-in-screen {.body {display: flex;flex-direction: column;justify-content: center;align-items: center;row-gap: 4.8rem;.first-section {width: 100%;.lottie {margin-top: 2rem;}}.second-section {width: 70%;padding: 4.8rem 0rem;}}}}
@media (max-width: 26.75em) {.sign-in-screen {.header {padding: 4.8rem 3.2rem;}.body {.second-section {width: 100%;padding: 4.8rem 0rem;}}}}
</style>
