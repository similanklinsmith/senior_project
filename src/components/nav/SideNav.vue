<template>
  <div class="sidebar">
    <div class="full-sidebar" :class="`${!isToggled ? 'is-expanded' : ''}`">
      <div class="toggle-button" @click="toggleSidebar">
        <i class="icon fa-solid fa-caret-right"></i>
      </div>
      <div class="logo">
        <img
          v-if="isToggled"
          src="../../assets/images/logo_text.png"
          alt="logo text image"
        />
        <img v-else src="../../assets/images/logo.png" alt="logo image" />
      </div>
      <router-link to="/" class="button">
        <i class="icon fa-solid fa-house"></i>
        <div class="button-text bold-small-text">home</div>
      </router-link>
      <router-link to="/calendar" class="button">
        <i class="icon fa-solid fa-calendar"></i>
        <div class="button-text bold-small-text">calendar</div>
      </router-link>
      <router-link to="/executives-management" class="button">
        <i class="icon fa-solid fa-user-group"></i>
        <div class="button-text bold-small-text">executives</div>
      </router-link>
      <router-link to="/meetings-management" class="button">
        <i class="icon fa-solid fa-check-to-slot"></i>
        <div class="button-text bold-small-text">meetings</div>
      </router-link>
      <router-link to="/about" class="button">
        <i class="icon fa-solid fa-gear"></i>
        <div class="button-text bold-small-text">setting</div>
      </router-link>
      <div class="asset-image" v-if="isToggled">
        <img src="../../assets/decorations/bad_mood.png" alt="" />
      </div>
    </div>
  </div>
  <router-view v-slot="{ Component }">
    <transition name="route">
      <component :is="Component" :key="$route.path"></component>
    </transition>
  </router-view>
</template>

<script>
export default {
  name: "SideNav",
  props: ["isToggled"],
  methods: {
    toggleSidebar() {
      this.$emit("toggleSidebar");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.full-sidebar {
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 30rem;
  background-color: $primaryGrey;
  display: flex;
  flex-direction: column;
  padding: 2.4rem 3.6rem;
  transition: 0.2s all ease-in-out;
  &.is-expanded {
    width: 12.5rem;
    .button {
      background-color: $primaryGrey;
    }
    .button-text {
      display: none;
    }
    .toggle-button {
      .icon {
        transform: rotate(180deg);
      }
    }
  }
  .toggle-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5rem;
    transform: translateX(1rem);
    right: 0;
    position: absolute;
    height: 3rem;
    width: 3rem;
    background-color: $primaryViolet;
    border-radius: 0.5rem;
    transition: 0.3s ease-in-out;
    cursor: pointer;
    .icon {
      color: $white;
      transition: 0.3s ease-in-out;
    }
  }
  .toggle-button:hover {
    background-color: $darkViolet;
  }
  .logo {
    img {
      height: 5.5rem;
    }
    margin-bottom: 10rem;
  }
  .asset-image {
    img {
      height: 13rem;
    }
    margin-top: 2rem;
  }
  a.router-link-exact-active.button {
    background-color: $primaryViolet;
  }
  a.router-link-exact-active.button:hover {
    background-color: $darkViolet;
  }
  a.router-link-exact-active .button-text,
  a.router-link-exact-active .icon {
    color: $white;
  }
  .button {
    height: 5rem;
    background-color: $grey;
    padding: 1rem 0rem;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-bottom: 3rem;
    text-decoration: none !important;
    transition: 0.2s all ease-in-out;
  }
  .button:hover {
    background-color: $fadedViolet;
    border-radius: 0.6rem;
  }
  .button-text {
    color: $darkViolet;
    margin-left: 0.5rem;
  }
  .icon {
    font-size: 1.4rem;
    color: $darkViolet;
  }
}
</style>
