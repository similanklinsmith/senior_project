<template>
  <div class="setting-screen">
    <BaseHeader
      :headerText="`Personal Settings & Helps`"
      :contentText="`Complete and Update your profile, Appearances, and click for Helps`"
    >
    </BaseHeader>
    <div class="body">
      <div class="container-section grid">
          <ProfileSettingView v-if="selectedMenu == 1" />
          <AppearanceSettingView v-if="selectedMenu == 2" />
          <HelpSettingView v-if="selectedMenu == 3" />
        <div class="right-side">
          <div class="content-text title">Personal Settings &amp; Helps</div>
          <div class="menus" v-for="(menu, index) in menus" :key="menu.id">
            <div class="menu" @click="onClickMenu(menu.id)">
              <div
                class="menu-logo flex-col-center"
                :style="
                  selectedMenu == menu.id ? { backgroundColor: '#7452FF' } : {}
                "
              >
                <i :class="['fa-solid ' + menu.icon]"></i>
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
  </div>
</template>

<script>
import BaseHeader from "@/components/UI/BaseHeader.vue";
import ProfileSettingView from "@/views/main/setting/ProfileSettingView.vue";
import AppearanceSettingView from "@/views/main/setting/AppearanceSettingView.vue";
import HelpSettingView from "@/views/main/setting/HelpSettingView.vue";
export default {
  components: {
    BaseHeader,
    ProfileSettingView,
    AppearanceSettingView,
    HelpSettingView,
  },
  name: "SettingView",
  data() {
    return {
      user: null,
      selectedMenu: 1,
      menus: [
        {
          id: 1,
          header: "Account Settings",
          detail: "Personal Information",
          icon: "fa-user",
        },
        {
          id: 2,
          header: "Appearances",
          detail: "Dark and Light Mode",
          icon: "fa-wand-magic-sparkles",
        },
        {
          id: 3,
          header: "Helps & Instructions",
          detail: "FAQ and Instructions",
          icon: "fa-info",
        },
      ],
    };
  },
  methods: {
    onClickMenu(id) {
      this.selectedMenu = id;
      localStorage.setItem("setting_menu", id);
    },
  },
  mounted() {
    window.onscroll = () => {
      this.isShowDropdown = false;
    };
    if (localStorage.getItem("setting_menu")) {
      this.selectedMenu = localStorage.getItem("setting_menu");
    }
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
</style>
