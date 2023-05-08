<template>
  <div id="app">
    <SplashView></SplashView>
    <div
      v-if="
        $route.name != 'NotFound' &&
        $route.name != 'sign-in' &&
        $route.name != 'ReAuthentication'
      "
    >
      <div
        class="modal"
        v-if="isToggled || isShowNoti"
        @click="(isToggled = false), (isShowNoti = false)"
      ></div>
      <div style="position: relative">
        <HeaderComp
          id="header"
          :headerText="getHeaderText"
          :inboxList="notificationMeeting"
          @signOut="handleSignOut"
        />
      </div>
      <div class="mobile-nav" id="mobile-header">
        <div class="burger-bar" @click="isToggled = !isToggled">
          <i class="icon fa-solid fa-bars-staggered"></i>
        </div>
        <div class="last-section">
          <div class="remark-text">{{ getHeaderText }}</div>
          <div class="notification" @click="isShowNoti = true">
            <div class="alert-circle">{{ notificationMeeting.length }}</div>
            <i class="icon fa-solid fa-bell"></i>
          </div>
        </div>
      </div>
      <transition name="mobileNav" appear class="nav-animation">
        <div class="noti-show" :class="`${isShowNoti ? 'is-expanded' : ''}`">
          <div class="bold-content-text new-header">
            {{ text["home"]["newlyIncoming"] }}
          </div>
          <div v-if="notificationMeeting.length > 0">
            <div
              class="noti-container"
              v-for="inbox in notificationMeeting.slice(0, 3)"
              :key="inbox.id"
            >
              <div
                class="noti"
                @click="
                  $router.push({ path: `/meetings-inbox/inbox/${inbox.id}` }),
                    (isShowNoti = false)
                "
              >
                <div class="mail-icon">
                  <img
                    src="@/assets/decorations/sample_profile.png"
                    alt="sending illustrations"
                  />
                </div>
                <div class="noti-detail">
                  <div class="meeting-title">
                    <span class="bold-content-text"
                      ><span v-if="inbox.title > 13">{{
                        inbox.title.substring(0, 13)
                      }}</span
                      ><span v-else>{{ inbox.title }}</span></span
                    ><span class="small-text">{{
                      formatDateTime(inbox.create_at)
                    }}</span>
                  </div>
                  <div class="meeting-content small-text">
                    <span v-if="inbox.meeting_detail.length > 13"
                      >{{ inbox.meeting_detail.substring(0, 13) }}...</span
                    ><span v-else>{{ inbox.meeting_detail }}</span>
                  </div>
                </div>
              </div>
              <div class="line" />
            </div>
          </div>
          <div v-else class="bold-small-text no-incoming">
            {{ text["home"]["noIncomingMeeting"] }}
          </div>
          <div
            @click="
              $router.push({ path: '/meetings-management' }),
                (isShowNoti = false)
            "
            class="see-all bold-content-text"
          >
            {{ text["home"]["seeAllMeeting"] }}
          </div>
        </div>
      </transition>
      <HeaderMobile
        :isToggled="isToggled"
        class="mobile-menu"
        @signOut="handleSignOut"
        @toggleCloseNav="isToggled = false"
      />
      <div class="space-left">
        <SideNav
          :isToggled="isToggled"
          @toggleSidebar="isToggled = !isToggled"
        />
      </div>
    </div>
    <div v-else>
      <router-view v-slot="{ Component }">
        <transition name="route" appear>
          <component :is="Component" :key="$route.path"></component>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import SplashView from "../src/views/splash/SplashView.vue";
import SideNav from "../src/components/nav/SideNav.vue";
import HeaderComp from "./components/header/HeaderComp.vue";
import HeaderMobile from "./components/header/HeaderMobile.vue";
import { formatDateTimeInbox } from "@/helpers/formatDateTime";
import { getAuth, signOut } from "firebase/auth";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { SideNav, HeaderComp, SplashView, HeaderMobile },
  data() {
    return {
      isToggled: false,
      isShowNoti: false,
      text: null,
      lang: null,
    };
  },
  computed: {
    ...mapGetters(["getterMyInboxes"]),
    getHeaderText() {
      switch (this.$route.name) {
        case "home":
          return this.text["home"]["headerTab"];
        case "executive":
          return this.text["executive"]["headerTab"];
        case "meeting":
          return this.text["meeting"]["headerTab"];
        case "setting":
          return this.text["setting"]["headerTab"];
        case "calendar":
          return this.text["calendar"]["headerTab"];
        default:
          return "Meeting Overview";
      }
    },
    notificationMeeting() {
      return this.getterMyInboxes.filter((inbox) => {
        return new Date(Date.now()) <= new Date(inbox.create_at);
      });
    },
  },
  methods: {
    ...mapActions(["getMyInboxes"]),
    formatDateTime(dateTime) {
      return formatDateTimeInbox(dateTime);
    },
    handleSignOut() {
      this.isToggled = false;
      signOut(this.$store.state.getAuth).then(() => {
        this.$router.push("/sign-in");
      });
      this.$store.dispatch("auth/logout");
      this.$store.state.getAuth = null;
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
  mounted() {
    this.$store.state.getAuth = getAuth();
    let htmlElement = document.documentElement;
    let theme = this.$cookies.get("mode");
    if (theme === "dark") {
      htmlElement.setAttribute("theme", "dark");
    } else {
      htmlElement.setAttribute("theme", "light");
    }
    if (window.location.pathname != "/sign-in") {
      window.addEventListener("scroll", () => {
        if (window.scrollY > document.getElementById("header").offsetTop) {
          document.getElementById("header").classList.add("fixed");
        } else {
          document.getElementById("header").classList.remove("fixed");
        }
        if (window.scrollY > document.getElementById("header").offsetTop) {
          document.getElementById("mobile-header").classList.add("fixed");
        } else {
          document.getElementById("mobile-header").classList.remove("fixed");
        }
      });
    }
  },
  created() {
    this.getMyInboxes();
  },
};
</script>
<style lang="scss" scoped>
@import "assets/colors/webColors.scss";
.nav-animation {transition: 0.3s all ease-in-out;}
.noti-show {.new-header {color: $highlightViolet;}&.is-expanded {transform: translateX(0);}display: flex;flex-direction: column;gap: 3rem;position: fixed;height: 100vh;width: 80%;background-color: $primaryGrey;z-index: 11;padding: 10rem 6rem;top: 0%;right: 0%;transform: translateX(150%);.content-text {color: $highlightViolet;}.see-all {color: $darkViolet;text-align: center !important;}.noti-container {display: flex;flex-direction: column;.line {width: 100% !important;margin: 1.5rem 0;height: 0.1rem;background-color: $grey;}}.noti {.line {width: 100% !important;margin: 1.5rem 0;height: 0.1rem;background-color: $grey;}column-gap: 2rem;display: flex;.mail-icon {min-width: 6rem;min-height: 6rem;width: 5rem;height: 5rem;padding: 0.4rem;background-color: $fadedViolet;border-radius: 0.8rem;img {width: 100%;height: 100%;object-fit: contain;}}.noti-detail {width: 100%;.meeting-content {color: $darkGrey;}.meeting-title {.small-text {color: $primaryViolet;}display: flex;justify-content: space-between;}display: flex;row-gap: 0.8rem;flex-direction: column;}}}
.mobile-menu {display: none;}.mobile-nav {.burger-bar {.icon {color: var(--colorTextHeaderComp);}}display: none;width: 100%;height: 12rem;background-color: var(--bgHeaderComp);padding: 3.2rem 4rem;justify-content: space-between;align-items: center;.icon {font-size: 2.8rem;color: $darkViolet;}.last-section {.remark-text {color: var(--colorTextHeaderComp);}display: flex;column-gap: 2rem;align-items: center;justify-content: center;.notification {cursor: pointer;position: relative;width: 4rem;height: 4rem;background-color: $primaryViolet;border-radius: 1rem;display: flex;justify-content: center;align-items: center;transition: 0.2s all ease-in-out;.icon {color: $white;font-size: 1.6rem;}.alert-circle {transform: translateX(0.6rem) translateY(-0.6rem);top: 0%;right: 0%;width: 1.5rem;height: 1.5rem;position: absolute;border-radius: 50%;background-color: $error;display: flex;justify-content: center;align-items: center;color: $white;font-weight: 600;font-size: 1.1rem;outline: 0.2rem solid $white;}&:hover {background-color: $darkViolet;.icon {animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;}}}}}.space-left {margin-left: 12.5em;}
.modal {width: 100%;height: 100vh;position: fixed;background-color: $fakeDark;opacity: 0.4;z-index: 9;}
.fixed {z-index: 8;top: 0%;position: fixed !important;background-color: var(--fixedBgHeaderComp);padding-bottom: 3.6rem;backdrop-filter: blur(10px) saturate(100%) contrast(45%) brightness(130%);-webkit-backdrop-filter: blur(10px) saturate(100%) contrast(45%)brightness(130%);transition: 0.3s all ease-in-out;}
@media (max-width: 26.75em) {.space-left {margin-left: 0;}#header {display: none;}.mobile-nav {display: flex;.last-section {.notification {width: 5.4rem;height: 5.4rem;.alert-circle {width: 2rem;height: 2rem;font-size: 1.4rem;outline: 0.4rem solid $white;}}}}.mobile-menu {display: flex;}}
@keyframes shake {10%,90% {transform: translate3d(-0.1rem, 0, 0);}20%,80% {transform: translate3d(0.1rem, 0, 0);}30%,50%,70% {transform: translate3d(-0.1rem, 0, 0);}40%,60% {transform: translate3d(0.1rem, 0, 0);}}
</style>