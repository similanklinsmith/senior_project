<template>
  <div class="container-header grid">
    <div class="remark-text">{{ headerText }}</div>
    <div class="search-input">
      <div class="input-icon">
        <i class="icon fa-solid fa-magnifying-glass"></i>
        <input
          class="small-text"
          type="text"
          placeholder="Search anything... "
        />
      </div>
    </div>
    <div class="last-section">
      <div class="notification">
        <div class="alert-circle">2</div>
        <i class="icon fa-solid fa-bell"></i>
      </div>
      <div class="profile" @click="toggleProfileDropdown">
        <div class="image-profile">
          <img
            :src="$store.state.myProfilePic"
            alt="profile of user"
            @error="
              $event.target.src =
                'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
            "
        />
        </div>
        <div class="thin-content-text display-name">{{ user }}</div>
        <i class="icon fa-solid fa-caret-down dropdown-icon"></i>
        <div
          class="dropdown__content"
          :class="`${isShowProfile ? 'is-show' : ''}`"
        >
          <ul>
        <li @click="$router.push({ path: '/setting' })">
        <div class="image-profile">
          <img
            :src="$store.state.myProfilePic"
            alt="profile of user"
            @error="
              $event.target.src =
                'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
            "
        />
        </div>
            <div class="bold-content-text">{{ user.length > 15 ? user.substring(0,15)+'...' : user }}</div>
            </li>
              <li><div class="line" /></li>
            <li>
              <div class="icon-container">
                <i class="icon fa-solid fa-pencil"></i>
              </div>
              <div class="thin-content-text" @click="$router.push({ path: '/setting' })">Edit my profile</div>
            </li>
            <li><div class="line" /></li>
            <li>
              <div class="icon-container">
                <i class="icon fa-solid fa-arrow-right-from-bracket"></i>
              </div>
              <div class="thin-content-text" @click="handleSignOut">
                Sign out
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jwtDecrypt from "@/helpers/jwtHelper";
import { mapActions } from "vuex";
export default {
  name: "HeaderComp",
  props: ["headerText"],
  data() {
    return {
      user: "",
      isShowProfile: false,
    };
  },
  methods: {
    ...mapActions(["getProfileImage"]),
    toggleProfileDropdown() {this.isShowProfile = !this.isShowProfile;},
    handleSignOut() {this.$emit("signOut");},
  },
  created() {this.getProfileImage();},
  mounted() {
    window.onscroll = () => {this.isShowProfile = false;};
    if (localStorage.getItem("user")) {this.user = `${jwtDecrypt(localStorage.getItem("user")).name}`;}
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
ul {width: 100%;list-style: none;li {gap:1.5rem;.icon-container{height: 3.6rem; width:3.6rem; border-radius: 1rem; display: flex; justify-content: center; align-items: center; background-color: $fadedViolet;}color: $darkViolet;display: flex;align-items: center;justify-content: flex-start;transition: 0.3s all ease-in-out;.icon {font-size: 1.4rem;margin-right: 1rem;transition: 0.3s all ease-in-out;}.line {width: 100% !important;margin: 1.5rem 0;height: 0.1rem;background-color: $grey;}}li:hover {color: $primaryViolet;.icon {color: $primaryViolet !important;}}}
.container-header {width: 100%;height: 10rem;background-color: var(--bgHeaderComp);align-items: center;grid-template-columns: 0.75fr 1.5fr 1fr;padding: 3rem 5.5rem 3rem 18rem;.remark-text {color: var(--colorTextHeaderComp);}.search-input {width: 100%;position: relative;display: flex;align-items: center;justify-items: center;.input-icon {width: 100%;position: absolute;display: flex;align-items: center;justify-items: center;
input[type="text"]{padding:1rem 1.4rem;width:100%;height:4rem;border-radius:.5rem;border:none;background-color:$primaryGrey;font-family:"Poppins",sans-serif}input[type="text"]:focus{outline:none;border:.1rem solid $primaryViolet}input::placeholder{font-size:1.4rem;color:$darkGrey}.icon{position:absolute;right:0;font-size:1.4rem;margin-right:1rem;color:$darkGrey}}}.last-section {display: flex;margin-left: 3rem;}.notification {margin-right: 3rem;cursor: pointer;position: relative;width: 3.5rem;height: 3.5rem;background-color: $primaryViolet;border-radius: 1rem;display: flex;justify-content: center;align-items: center;transition: 0.2s all ease-in-out;.icon {color: $white;font-size: 1.6rem;}.alert-circle {transform: translateX(0.6rem) translateY(-0.6rem);top: 0%;right: 0%;width: 1.5rem;height: 1.5rem;position: absolute;border-radius: 50%;background-color: $error;display: flex;justify-content: center;align-items: center;color: $white;font-weight: 600;font-size: 1.1rem;outline: 0.2rem solid $white;}}.notification:hover {background-color: var(--notiHover);.icon {animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;}}.profile {.dropdown-icon{color:var(--caret) !important}.display-name{color:var(--colorTextHeaderComp)}display: flex;align-items: center;position: relative;cursor: pointer;.image-profile {overflow:hidden;width: 3.5rem;height: 3.5rem;background-color: $primaryViolet;border-radius: 1rem;margin-right: 1rem;}.icon {margin-left: 0.8rem;font-size: 1.4rem;color: var(--colorTextHeaderComp);}.dropdown__content {.image-profile{margin-right:0}.icon{color: $darkViolet;}box-shadow: 0px 0px 5px $fadedViolet;z-index: -1;display: flex;flex-direction: column; text-align: center;justify-content: center;align-items: center;margin-top: 25rem;position: absolute;opacity: 0;width: 100%;min-width: 25rem;background-color: $white;overflow: hidden;padding: 2.8rem;transition: 0.3s all ease-in-out;border-radius: 1.5rem;cursor: auto;&.is-show {transform: translateY(2rem);opacity: 1;z-index: 1;cursor: pointer;}}}}
@keyframes shake{10%,90%{transform:translate3d(-0.1rem,0,0)}20%,80%{transform:translate3d(0.1rem,0,0)}30%,50%,70%{transform:translate3d(-0.1rem,0,0)}40%,60%{transform:translate3d(0.1rem,0,0)}}
@media (max-width: 40em) {.container-header {grid-template-columns: 0.75fr 1.25fr 1.25fr;}}
</style>
