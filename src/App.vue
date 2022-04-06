<template>
  <div class="space-left">
    <div class="modal" v-if="isToggled" @click="isToggled = false"></div>
    <HeaderComp />
    <SideNav :isToggled="isToggled" @toggleSidebar="isToggled = !isToggled" />
  </div>
</template>

<script>
import SideNav from "../src/components/nav/SideNav.vue";
import HeaderComp from "./components/header/HeaderComp.vue";
export default {
  components: { SideNav, HeaderComp },
  data() {
    return {
      isToggled: false,
    };
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
</style>
