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
      <div class="mobile-nav" id="mobile-header">
        <div class="burger-bar" @click="isToggled = !isToggled">
          <i class="icon fa-solid fa-bars-staggered"></i>
        </div>
        <div class="last-section">
          <div class="remark-text">Meeting Overview</div>
          <div class="notification">
            <div class="alert-circle">2</div>
            <i class="icon fa-solid fa-bell"></i>
          </div>
        </div>
      </div>
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
export default {
  components: { SideNav, HeaderComp, SplashView, HeaderMobile },
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
        case "setting":
          return "My personal setting";
        default:
          return "Meeting Overview";
      }
    },
  },
  methods: {
    handleSignOut() {
      this.isToggled = false;
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
        if (window.scrollY > document.getElementById("header").offsetTop) {
          document.getElementById("mobile-header").classList.add("fixed");
        } else {
          document.getElementById("mobile-header").classList.remove("fixed");
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
@import "assets/colors/webColors.scss";
.mobile-menu {
  display: none;
}
.mobile-nav {
  display: none;
  width: 100%;
  height: 10rem;
  background-color: $white;
  padding: 2.4rem 5.5rem;
  justify-content: space-between;
  align-items: center;
  .icon {
    font-size: 2.8rem;
    color: $darkViolet;
  }
  .last-section {
    display: flex;
    column-gap: 2rem;
    align-items: center;
    justify-content: center;
    .notification {
      cursor: pointer;
      position: relative;
      width: 4rem;
      height: 4rem;
      background-color: $primaryViolet;
      border-radius: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.2s all ease-in-out;
      .icon {
        color: $white;
        font-size: 1.6rem;
      }
      .alert-circle {
        transform: translateX(0.6rem) translateY(-0.6rem);
        top: 0%;
        right: 0%;
        width: 1.5rem;
        height: 1.5rem;
        position: absolute;
        border-radius: 50%;
        background-color: $error;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $white;
        font-weight: 600;
        font-size: 1.1rem;
        outline: 0.2rem solid $white;
      }
      &:hover {
        background-color: $darkViolet;
        .icon {
          animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      }
    }
  }
}
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
  z-index: 12;
  top: 0%;
  position: fixed !important;
  background-color: rgba(255, 255, 255, 0.75);
  padding-bottom: 3.6rem;
  backdrop-filter: blur(10px) saturate(100%) contrast(45%) brightness(130%);
  -webkit-backdrop-filter: blur(10px) saturate(100%) contrast(45%)
    brightness(130%);
  transition: 0.3s all ease-in-out;
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-0.1rem, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(0.1rem, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-0.1rem, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(0.1rem, 0, 0);
  }
}
@media (max-width: 26.75em) {
  .space-left {
    margin-left: 0;
  }
  #header {
    display: none;
  }
  .mobile-nav {
    display: flex;
    .last-section {
      .notification {
        width: 5.4rem;
        height: 5.4rem;
        .alert-circle {
          width: 2rem;
          height: 2rem;
          font-size: 1.4rem;
          outline: 0.4rem solid $white;
        }
      }
    }
  }
  .mobile-menu {
    display: flex;
  }
}
</style>
