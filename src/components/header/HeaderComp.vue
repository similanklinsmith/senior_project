<template>
  <div class="container-header grid">
    <div class="remark-text">{{ headerText }}</div>
    <div class="search-input">
      <div class="input-icon">
        <i class="icon fa-solid fa-magnifying-glass"></i>
        <input
          class="small-text"
          type="text"
          :placeholder="text['home']['search']"
          @focus="(isShowList = true), (isShowProfile = false), onFocus()"
          @blur="(isShowList = false), onBlur()"
          v-model="inputSearch"
          id="search-input"
        />
      </div>
      <div class="search-list" :class="`${isShowList ? 'is-show' : ''}`">
        <transition-group name="route" appear>
          <div
            class="list"
            v-for="list in filterSearch"
            :key="list.id"
            @mousedown="toggleSearch(list.title, list.path)"
          >
            <div class="small-text">{{ list.title }}</div>
          </div>
        </transition-group>
      </div>
    </div>
    <div class="last-section">
      <div class="notification" @click="toggleNotiDropdown">
        <div class="alert-circle">{{ inboxList.length }}</div>
        <i class="icon fa-solid fa-bell"></i>
        <div
          class="dropdown__content"
          :class="`${isShowNoti ? 'is-show' : ''}`"
          :style="inboxList.length == 0 ? { marginTop: '14rem !important' } : inboxList.length == 1 ? {marginTop: '18rem !important'} : {}"
          @mouseleave="isShowNoti = false"
        >
          <ul>
            <li
              @click="
                $router.push({ path: `/meetings-inbox/inbox/${inbox.id}` })
              "
              v-for="inbox in inboxList.slice(0, 3)"
              :key="inbox.id"
            >
              <div class="noti-container">
                <div class="mail-icon">
                  <img
                    src="@/assets/decorations/sample_profile.png"
                    alt="sending illustrations"
                  />
                </div>
                <div class="noti-detail">
                  <div class="meeting-title">
                    <div class="bold-small-text"><span v-if="inbox.title.length > 25">{{ inbox.title.substring(0, 25) }}...</span><span v-else>{{ inbox.title }}</span></div>
                    <div class="small-text date">
                      {{ formatDateTime(inbox.create_at) }}
                    </div>
                  </div>
                  <div class="small-text">
                    <span v-if="inbox.meeting_detail.length > 25"
                      >{{ inbox.meeting_detail.substring(0, 25) }}...</span
                    >
                    <span v-else>{{ inbox.meeting_detail }}</span>
                  </div>
                </div>
              </div>
              <div class="line"></div>
            </li>
            <li v-if="inboxList.length == 0">
              <div class="bold-small-text no-incoming">{{text['home']['noNewMeeting']}}</div>
              <div class="line"></div>
            </li>
            <li class="see-all">
              <div
                @click="$router.push({ path: '/meetings-management' })"
                class="bold-small-text"
              >
                {{ text["home"]["seeAllMeeting"] }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="profile" @click="toggleProfileDropdown">
        <div class="image-profile" v-if="$store.state.myProfilePic">
          <img
            :src="$store.state.myProfilePic"
            alt="profile of user"
            @error="
              $event.target.src =
                'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
            "
          />
        </div>
        <div class="default-profile" v-else>
          <img
            src="@/assets/decorations/sample_profile.png"
            alt="sample profile illustration"
          />
        </div>
        <div class="thin-content-text display-name" v-if="getterMyProfile">{{ getterMyProfile.name }}</div>
        <i class="icon fa-solid fa-caret-down dropdown-icon"></i>
        <div
          class="dropdown__content"
          :class="`${isShowProfile ? 'is-show' : ''}`"
          @mouseleave="isShowProfile = false"
        >
          <ul>
            <li @click="$router.push({ path: '/setting' })">
              <div class="image-profile" v-if="$store.state.myProfilePic">
                <img
                  :src="$store.state.myProfilePic"
                  alt="profile of user"
                  @error="
                    $event.target.src =
                      'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
                  "
                />
              </div>
              <div class="default-profile" v-else>
                <img
                  src="@/assets/decorations/sample_profile.png"
                  alt="sample profile illustration"
                />
              </div>
              <div style="text-align: start">
                <div class="bold-content-text" v-if="getterMyProfile">
                  {{ getterMyProfile.name.length > 15 ? getterMyProfile.name.substring(0, 15) + "..." : getterMyProfile.name }}
                </div>
                <div class="small-text">
                  {{ text["authentication"]["viewProfile"] }}
                </div>
              </div>
            </li>
            <li><div class="line" /></li>
            <li @click="editProfile">
              <div class="icon-container">
                <i class="icon fa-solid fa-pencil"></i>
              </div>
              <div class="thin-content-text">
                {{ text["authentication"]["editProfile"] }}
              </div>
            </li>
            <li><div class="line" /></li>
            <li @click="handleSignOut">
              <div class="icon-container">
                <i class="icon fa-solid fa-arrow-right-from-bracket"></i>
              </div>
              <div class="thin-content-text">
                {{ text["authentication"]["signOut"] }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="language" @click="toggleLanguageDropdown">
        <div class="language-text">
          <div class="bold-small-text">{{ lang.toUpperCase() }}</div>
          <i class="icon fa-solid fa-caret-down dropdown-icon"></i>
        </div>

        <div
          class="dropdown__content"
          :class="`${isShowLang ? 'is-show' : ''}`"
          @mouseleave="isShowLang = false"
        >
          <ul>
            <li>
              <div
                class="bold-small-text"
                @click="changeLanguage('th')"
                :style="lang == 'th' ? { color: '#7452FF' } : {}"
              >
                TH-ภาษาไทย
              </div>
            </li>
            <li><div class="line" /></li>
            <li>
              <div
                class="bold-small-text"
                @click="changeLanguage('en')"
                :style="lang == 'en' ? { color: '#7452FF' } : {}"
              >
                EN-English
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateTimeInbox } from "@/helpers/formatDateTime";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "HeaderComp",
  props: ["headerText", "inboxList"],
  data() {
    return {
      text: null,
      lang: null,
      isShowLang: false,
      isShowNoti: false,
      isShowProfile: false,
      isShowList: false,
      inputSearch: "",
      searchList: null,
    };
  },
  computed: {
    ...mapGetters(["getterMyProfile"]),
    filterSearch() {
      return this.searchList.filter((list) => {
        return list.title
          .toLowerCase()
          .includes(this.inputSearch.toLowerCase());
      });
    }
  },
  methods: {
    ...mapActions(["getProfileImage", "getMyProfile"]),
    formatDateTime(dateTime) {
      return formatDateTimeInbox(dateTime);
    },
    changeLanguage(lang) {
      this.$cookies.set("lang", lang);
      window.location.reload();
    },
    toggleNotiDropdown() {
      this.isShowLang = false;
      this.isShowProfile = false;
      this.isShowNoti = !this.isShowNoti;
    },
    toggleProfileDropdown() {
      this.isShowLang = false;
      this.isShowNoti = false;
      this.isShowProfile = !this.isShowProfile;
    },
    toggleLanguageDropdown() {
      this.isShowProfile = false;
      this.isShowNoti = false;
      this.isShowLang = !this.isShowLang;
    },
    onFocus() {
      document.getElementById("search-input").placeholder =
        this.text["home"]["focusSearch"];
    },
    onBlur() {
      document.getElementById("search-input").placeholder =
        this.text["home"]["search"];
    },
    editProfile() {
      this.$router.push({ path: "/setting" });
      localStorage.setItem("setting_menu", 1);
    },
    handleSignOut() {
      this.$emit("signOut");
    },
    toggleSearch(title, path) {
      if (path != "/meetings-management") {
        this.$router.push({ path: path });
      } else {
        switch (title) {
          case "Create poll meeting":
            localStorage.setItem("index", 1);
            break;
          case "Inbox":
            localStorage.setItem("index", 2);
            break;
          case "Sent":
            localStorage.setItem("index", 3);
            break;
          case "Poll":
            localStorage.setItem("index", 4);
            break;
          case "Result of poll":
            localStorage.setItem("index", 5);
            break;
          case "Replied":
            localStorage.setItem("index", 6);
            break;
          default:
            localStorage.setItem("index", 1);
            break;
        }
        this.$router.push({ path: path });
      }
      this.inputSearch = "";
      this.isShowList = false;
    },
  },
  created() {
    this.getProfileImage();
    this.getMyProfile();
  },
  mounted() {
    window.onscroll = () => {
      this.isShowProfile = false;
    };
  },
  beforeMount() {
    if (this.$cookies.get("lang")) {
      this.lang = this.$cookies.get("lang");
    } else {
      this.lang = "en";
    }
    this.text = require(`@/assets/langs/${this.lang}.json`);
    this.searchList = [
      {
        id: 1,
        title: this.text["headerComp"]["1"],
        path: "/executives-management",
      },
      {
        id: 2,
        title: this.text["headerComp"]["2"],
        path: "/meetings-management",
      },
      {
        id: 3,
        title: this.text["headerComp"]["3"],
        path: "/meetings-management",
      },
      {
        id: 4,
        title: this.text["headerComp"]["4"],
        path: "/meetings-management",
      },
      {
        id: 5,
        title: this.text["headerComp"]["5"],
        path: "/meetings-management",
      },
      {
        id: 6,
        title: this.text["headerComp"]["6"],
        path: "/meetings-management",
      },
      {
        id: 7,
        title: this.text["headerComp"]["7"],
        path: "/meetings-management",
      },
      { id: 8, title: this.text["headerComp"]["8"], path: "/setting" },
    ];
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
ul {width: 100%;list-style: none;li {gap: 1.5rem;.icon-container {height: 3.6rem;width: 3.6rem;border-radius: 1rem;display: flex;justify-content: center;align-items: center;background-color: $fadedViolet;}color: $darkViolet;display: flex;align-items: center;justify-content: flex-start;transition: 0.3s all ease-in-out;.icon {font-size: 1.4rem;margin-right: 1rem;transition: 0.3s all ease-in-out;}.line {width: 100% !important;margin: 1.5rem 0;height: 0.1rem;background-color: $grey;}}li:hover {color: $primaryViolet;.icon {color: $primaryViolet !important;}}}
.container-header {width: 100%;height: 10rem;background-color: var(--bgHeaderComp);align-items: center;grid-template-columns: 0.6fr 1.25fr 1.1fr;padding: 3rem 5.5rem 3rem 18rem;.remark-text {color: var(--colorTextHeaderComp);}.search-input {width: 100%;position: relative;display: flex;align-items: center;justify-items: center;.input-icon {width: 100%;position: absolute;display: flex;align-items: center;justify-items: center;input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}.icon {position: absolute;right: 0;font-size: 1.4rem;margin-right: 1rem;color: $darkGrey;}}}.last-section {display: flex;margin-left: 3rem;}.language {margin-left: 3rem;position: relative;cursor: pointer;width: 4.25rem;height: 3.5rem;background-color: $fadedViolet;border-radius: 1rem;transition: 0.2s all ease-in-out;.language-text {display: flex;justify-content: space-evenly;align-items: center;height: 100%;color: $white;}&:hover {background-color: $highlightViolet;}.dropdown__content {.small-text {color: $darkGrey !important;margin-top: 0.25rem;font-weight: 300;}.image-profile {margin-right: 0;}.icon {color: $darkViolet;}pointer-events: none;box-shadow: 0px 0px 5px $fadedViolet;z-index: -1;display: flex;flex-direction: column;text-align: center;justify-content: center;align-items: center;position: absolute;opacity: 0;width: 100%;min-width: 12rem;background-color: $white;overflow: hidden;padding: 2rem;transition: 0.3s all ease-in-out;border-radius: 1.5rem;cursor: auto;&.is-show {transform: translateY(1rem);opacity: 1;z-index: 1;cursor: pointer;pointer-events: visible;}}}.notification {margin-right: 3rem;cursor: pointer;position: relative;width: 3.5rem;height: 3.5rem;background-color: $primaryViolet;border-radius: 1rem;display: flex;justify-content: center;align-items: center;transition: 0.2s all ease-in-out;.dropdown__content {.see-all {align-items: center !important;}li {flex-direction: column;row-gap: 0;.no-incoming {color: $darkGrey !important;}.noti-container {width: 100%;display: flex;flex-direction: row;column-gap: 1rem;}.noti-detail {width: 100%;flex-direction: column !important;text-align: left;align-items: flex-start;row-gap: 0.8rem;}.mail-icon {min-width: 5rem;min-height: 5rem;width: 5rem;height: 5rem;padding: 0.4rem;background-color: $fadedViolet;border-radius: 1rem;img {width: 100%;height: 100%;object-fit: contain;}}.meeting-title {display: flex;justify-content: space-between;width: 100%;.date {color: $highlightViolet !important;}}}.small-text {color: $darkGrey !important;margin-top: 0.25rem;font-weight: 300;}.image-profile {margin-right: 0;}.icon {color: $darkViolet;}pointer-events: none;box-shadow: 0px 0px 5px $fadedViolet;z-index: -1;display: flex;flex-direction: column;text-align: center;justify-content: center;align-items: center;margin-top: 33rem;position: absolute;opacity: 0;width: 100%;min-width: 40rem;background-color: $white;overflow: hidden;padding: 2.8rem;transition: 0.3s all ease-in-out;border-radius: 1.5rem;cursor: auto;&.is-show {transform: translateY(2rem);opacity: 1;z-index: 2;cursor: pointer;pointer-events: visible;}}.icon {color: $white;font-size: 1.6rem;}.alert-circle {transform: translateX(0.6rem) translateY(-0.6rem);top: 0%;right: 0%;width: 1.5rem;height: 1.5rem;position: absolute;border-radius: 50%;background-color: $error;display: flex;justify-content: center;align-items: center;color: $white;font-weight: 600;font-size: 1.1rem;outline: 0.2rem solid $white;}}.notification:hover {background-color: var(--notiHover);.icon {animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;}}.profile {.dropdown-icon {color: var(--caret) !important;}.display-name {color: var(--colorTextHeaderComp);}display: flex;align-items: center;position: relative;cursor: pointer;.image-profile,.default-profile {overflow: hidden;width: 3.5rem;height: 3.5rem;background-color: $primaryViolet;border-radius: 1rem;margin-right: 1rem;}.default-profile {padding: 0.2rem;}.icon {margin-left: 0.8rem;font-size: 1.4rem;color: var(--colorTextHeaderComp);}.dropdown__content {.small-text {color: $darkGrey !important;margin-top: 0.25rem;font-weight: 300;}.image-profile {margin-right: 0;}.icon {color: $darkViolet;}pointer-events: none;box-shadow: 0px 0px 5px $fadedViolet;z-index: -1;display: flex;flex-direction: column;text-align: center;justify-content: center;align-items: center;margin-top: 25rem;position: absolute;opacity: 0;width: 100%;min-width: 25rem;background-color: $white;overflow: hidden;padding: 2.8rem;transition: 0.3s all ease-in-out;border-radius: 1.5rem;cursor: auto;&.is-show {transform: translateY(2rem);opacity: 1;z-index: 1;cursor: pointer;pointer-events: visible;}}}}
@keyframes shake {10%,90% {transform: translate3d(-0.1rem, 0, 0);}20%,80% {transform: translate3d(0.1rem, 0, 0);}30%,50%,70% {transform: translate3d(-0.1rem, 0, 0);}40%,60% {transform: translate3d(0.1rem, 0, 0);}}
@media (max-width: 60em) {.container-header {grid-template-columns: 0.55fr 0.8fr 1.2fr;.last-section,.notification {margin-right: 2rem;}}}
.search-list {pointer-events: none;opacity: 0;top: -20%;position: absolute;display: flex;flex-direction: column;width: 100%;background-color: $white;border-radius: 2rem;overflow: hidden;box-shadow: 0px 0px 5px $fadedViolet;transition: 0.3s all ease-in-out;&.is-show {transform: translateY(3rem);opacity: 1;z-index: 6;cursor: pointer;pointer-events: visible;}.list {width: 100%;padding: 1.6rem 2rem;background-color: $white;transition: 0.2s all ease-in-out;cursor: pointer;&:hover {background-color: $fadedViolet;color: $primaryViolet;}}}
</style>
