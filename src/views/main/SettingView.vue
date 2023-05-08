<template>
  <div class="setting-screen">
    <BaseHeader
      :headerText="text['setting']['header']"
      :contentText="text['setting']['subHeader']"
    >
    </BaseHeader>
    <div class="body">
      <div class="container-section grid">
        <ProfileSettingView v-if="selectedMenu == 1" />
        <AppearanceSettingView v-if="selectedMenu == 2" />
        <HelpSettingView v-if="selectedMenu == 3" />
        <div class="right-side">
          <div class="content-text title">{{ text["setting"]["header"] }}</div>
          <div class="menus" v-for="(menu, index) in menus" :key="menu.id">
            <div class="menu" @click="onClickMenu(menu.id)">
              <div
                class="menu-logo flex-col-center"
                :style="
                  selectedMenu == menu.id ? { backgroundColor: '#7452FF' } : {}
                "
              >
                <i :class="menu.icon"></i><i class="flag flag-united-states"></i>
              </div>
              <div class="content">
                <div
                  class="header bold-content-text"
                  :style="selectedMenu == menu.id ? { color: '#7452FF' } : {}"
                >
                  {{ menu.header }}
                </div>
                <div
                  class="detail small-text"
                  :style="selectedMenu == menu.id ? { color: '#DBD2FF' } : {}"
                >
                  {{ menu.detail }}
                </div>
              </div>
            </div>
            <div class="line" v-if="index != menus.length - 1" />
          </div>
        </div>
      </div>
    </div>
    <BaseComposeButton
      v-if="isMobile"
      :isShowComposeButton="isShowComposeButton"
      :isSelected="selectedMenu"
      @onClick="onClickMenu"
      @toggleButton="isShowComposeButton = !isShowComposeButton"
      :buttons="menus"
    />
  </div>
</template>

<script>
import BaseHeader from "@/components/UI/BaseHeader.vue";
import BaseComposeButton from "@/components/UI/BaseComposeButton.vue";
import ProfileSettingView from "@/views/main/setting/ProfileSettingView.vue";
import AppearanceSettingView from "@/views/main/setting/AppearanceSettingView.vue";
import HelpSettingView from "@/views/main/setting/HelpSettingView.vue";
export default {
  components: {
    BaseHeader,
    BaseComposeButton,
    ProfileSettingView,
    AppearanceSettingView,
    HelpSettingView,
  },
  name: "SettingView",
  data() {
    return {
      text: null,
      lang: null,
      isShowComposeButton: false,
      user: null,
      selectedMenu: 1,
      isMobile: false,
      menus: null,
    };
  },
  methods: {
    onClickMenu(id) {
      this.isShowComposeButton = false;
      this.selectedMenu = id;
      localStorage.setItem("setting_menu", id);
    },
    onResize() {
      this.isMobile = window.innerWidth < 428;
    },
  },
  mounted() {
    window.scrollTo(0, 0);
    window.onscroll = () => {
      this.isShowDropdown = false;
    };
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
    if (localStorage.getItem("setting_menu")) {
      this.selectedMenu = localStorage.getItem("setting_menu");
    }
    this.menus = [
      {
        id: 1,
        header: this.text["setting"]["accountHeader"],
        tooltip: this.text["setting"]["accountHeader"],
        detail: this.text["setting"]["accountSubHeader"],
        icon: "fa-solid fa-user",
      },
      {
        id: 2,
        header: this.text["setting"]["appearanceHeader"],
        tooltip: this.text["setting"]["appearanceHeader"],
        detail: this.text["setting"]["appearanceSubHeader"],
        icon: "fa-solid fa-wand-magic-sparkles",
      },
      {
        id: 3,
        header: this.text["setting"]["helpHeader"],
        tooltip: this.text["setting"]["helpHeader"],
        detail: this.text["setting"]["helpSubHeader"],
        icon: "fa-solid fa-info",
      },
    ];
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
.setting-screen {
  .body {
    padding: 3rem;
    .container-section {
      width: 100%;
      grid-template-columns: 1.35fr 0.65fr;
      position: relative;
      column-gap: 2rem;
      .title {
        color: $darkGrey;
      }

      .right-side {
        height: fit-content;
        background-color: $white;
        padding: 4.8rem 3.6rem;
        border-radius: 2.5rem;
        display: flex;
        flex-direction: column;
        row-gap: 3rem;
        .menus {
          display: flex;
          flex-direction: column;
          row-gap: 3rem;
          .line {
            width: 100%;
            background-color: $grey;
            height: 1px;
          }
          .menu {
            cursor: pointer;
            transition: 0.2s all ease-in-out;
            display: flex;
            align-content: center;
            column-gap: 1.75rem;
            &:hover {
              color: $primaryViolet;
            }
            .menu-logo {
              font-size: 1.4rem;
              color: $white;
              width: 4rem;
              height: 4rem;
              border-radius: 0.5rem;
              background-color: $fadedViolet;
              transition: 0.2s all ease-in-out;
            }
            .content {
              display: flex;
              flex-direction: column;
              row-gap: 0.75rem;
              .detail {
                color: $darkGrey;
                transition: 0.2s all ease-in-out;
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 26.75em) {
  .setting-screen {
    .body {
      .container-section {
        display: block;
        .right-side {
          display: none;
        }
      }
    }
  }
}
</style>
