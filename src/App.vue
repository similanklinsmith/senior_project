<template>
  <div id="app">
    <SplashView></SplashView>
    <div v-if="$route.name != 'NotFound' && $route.name != 'sign-in'">
      <div class="modal" v-if="isToggled" @click="isToggled = false"></div>
      <div style="position: relative">
        <HeaderComp
          id="header"
          :headerText="getHeaderText"
          @signOut="handleSignOut"
        />
      </div>
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
export default {
  components: { SideNav, HeaderComp, SplashView },
  data() {
    return {
      isToggled: false,
    };
  },
  computed: {
    getHeaderText() {
      switch (this.$route.name) {
        case "home":
          return "Meeting Overview";
        case "executive":
          return "My executives";
        case "meeting":
          return "My meetings";
        default:
          return "Meeting Overview";
      }
    },
  },
  methods: {
    handleSignOut() {
      this.$store.dispatch("auth/logout").then(() => {
        this.$router.replace("/sign-in");
      });
    },
  },
  mounted() {
    // let htmlElement = document.documentElement;
    // htmlElement.setAttribute("theme", "light");
    if (window.location.pathname != "/sign-in") {
      window.addEventListener("scroll", () => {
        if (window.scrollY > document.getElementById("header").offsetTop) {
          document.getElementById("header").classList.add("fixed");
        } else {
          document.getElementById("header").classList.remove("fixed");
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
@import "assets/colors/webColors.scss";
.space-left {
  margin-left: 12.5em;
}
.modal {
  width: 100%;
  height: 100vh;
  position: fixed;
  background-color: $fakeDark;
  opacity: 0.4;
  z-index: 9;
}
.fixed {
  z-index: 8;
  top: 0%;
  position: fixed !important;
  background-color: rgba(255, 255, 255, 0.75);
  padding-bottom: 3.6rem;
  backdrop-filter: blur(10px) saturate(100%) contrast(45%) brightness(130%);
  -webkit-backdrop-filter: blur(10px) saturate(100%) contrast(45%)
    brightness(130%);
  transition: 0.3s all ease-in-out;
}
</style>
