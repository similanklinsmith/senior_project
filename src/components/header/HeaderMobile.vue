<template>
  <transition name="mobileNav" appear class="nav-animation">
    <div class="full-mobile-nav" :class="`${isToggled ? 'is-expanded' : ''}`">
      <div class="profile">
        <div class="profile-image">
            <img
              v-if="$store.state.myProfilePic"
              :src="$store.state.myProfilePic"
              alt="profile of user"
              @error="
                $event.target.src =
                  'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
              "
        />
        <img
          v-else
          src="@/assets/decorations/sample_profile.png"
          alt="sample profile illustration"
        />
        </div>
        <div class="profile-info">
          <div class="remark-text">{{ user }}</div>
          <div class="content-text">{{ email }}</div>
        </div>
        <div class="next-button">
          <i class="icon fa-solid fa-angle-right"></i>
        </div>
      </div>
      <div>
        <div class="line" />
      </div>
      <router-link
        to="/"
        class="button"
        aria-label="home"
        @click="toggleCloseNav"
      >
        <i class="icon fa-solid fa-house"></i>
        <div class="button-text bold-content-text">home</div>
      </router-link>
      <router-link
        to="/calendar"
        class="button"
        aria-label="calendar"
        @click="toggleCloseNav"
      >
        <i class="icon fa-solid fa-calendar"></i>
        <div class="button-text bold-content-text">calendar</div>
      </router-link>
      <router-link
        to="/executives-management"
        class="button"
        aria-label="executives"
        @click="toggleCloseNav"
      >
        <i class="icon fa-solid fa-user-group"></i>
        <div class="button-text bold-content-text">executives</div>
      </router-link>
      <router-link
        to="/meetings-management"
        class="button"
        aria-label="meetings"
        @click="toggleCloseNav"
      >
        <i class="icon fa-solid fa-check-to-slot"></i>
        <div class="button-text bold-content-text">meetings</div>
      </router-link>
      <router-link
        to="/setting"
        class="button"
        aria-label="setting"
        @click="toggleCloseNav"
      >
        <i class="icon fa-solid fa-gear"></i>
        <div class="button-text bold-content-text">setting</div>
      </router-link>
      <div class="sign-out">
        <BaseButton
          buttonType="outlined-button"
          btnText="Sign out"
          textColor="#7452FF"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          height="7rem"
          width="100%"
          fontSize="1.8rem"
          @click="handleSignOut"
        >
          >
          <template v-slot:before-icon>
            <i class="fa-solid fa-arrow-right-from-bracket"></i> </template
        ></BaseButton>
      </div>
      <div class="asset-image">
        <img
          src="@/assets/decorations/bad_mood.png"
          alt="illustration decoration"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import jwtDecrypt from "@/helpers/jwtHelper";
import BaseButton from "@/components/UI/BaseButton.vue";
import { mapActions } from "vuex";
export default {
  name: "HeaderMobile",
  components: { BaseButton },
  props: ["isToggled"],
  data() {
    return {
      user: "",
      email: "",
      isShowProfile: false,
    };
  },
  methods: {
    ...mapActions(["getProfileImage"]),
    handleSignOut() {this.$emit("signOut");},
    toggleCloseNav() {this.$emit("toggleCloseNav");},
  },
  created() {this.getProfileImage();},
  mounted() {
    if (localStorage.getItem("user")) {this.user = `${jwtDecrypt(localStorage.getItem("user")).name}`;this.email = `${jwtDecrypt(localStorage.getItem("user")).email}`}
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.full-mobile-nav {display: flex;flex-direction: column;gap: 3rem;position: fixed;height: 100vh;width: 80%;background-color: $primaryGrey;z-index: 11;padding: 10rem 6rem;top: 0%;transform: translateX(-100%);.line {width: 100%;height: 0.1rem;background-color: $darkGrey;margin-top: 3rem;margin-bottom: 4rem;}&.is-expanded {transform: translateX(0);}.profile {display: flex;justify-content: space-around;align-items: center;.profile-image {overflow:hidden;width: 5.4rem;height: 5.4rem;border-radius: 0.5rem;background-color: $fadedViolet;}.profile-info {display: flex;flex-direction: column;row-gap: 0.5rem;.content-text {color: $highlightViolet;}}.next-button {font-size: 1.6rem;background-color: $yellow;padding: 1rem 1.5rem;border-radius: 50%;.icon {color: $white;}}}}
a.router-link-exact-active.button{background-color:$primaryViolet}a.router-link-exact-active.button:hover{background-color:$darkViolet}a.router-link-exact-active .button-text,a.router-link-exact-active .icon{color:$white}.button{background-color:$grey;padding:3rem 0;border-radius:1rem;display:flex;justify-content:center;align-items:center;cursor:pointer;text-decoration:none!important;transition:.2s all ease-in-out}.button:hover{background-color:$fadedViolet;border-radius:.6rem}.button-text{color:$darkViolet;margin-left:.5rem}.icon{font-size:1.4rem;color:$darkViolet}.sign-out{margin-top:6rem}.asset-image {margin-top: 5rem;width: 100%;display: flex;justify-content: center;img {width: 80%;}}
.nav-animation {transition: 0.3s all ease-in-out;}
@media (max-width: 24em) {.full-mobile-nav {padding: 10rem 4rem;}}
</style>
