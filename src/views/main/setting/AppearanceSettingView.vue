<template>
  <div class="left-side">
    <div class="content-text title">{{ text["appearance"]["appearance"] }}</div>
    <div class="modes">
      <div
        class="mode"
        @click="handleMode('light')"
        :style="
          mode == 'light'
            ? { boxShadow: 'inset 0 0 0 1px rgba(116, 82, 255, 1)' }
            : {}
        "
      >
        <div
          class="check-box"
          :style="mode == 'light' ? { backgroundColor: '#FFCB57' } : {}"
        />
        <div class="content">
          <div
            class="header bold-content-text"
            :style="mode == 'light' ? { color: '#23106D' } : {}"
          >
            {{ text["appearance"]["lightMode"] }}
          </div>
          <div
            class="detail small-text"
            :style="mode == 'light' ? { color: '#A58EFF' } : {}"
          >
            {{ text["appearance"]["lightSubHeader"] }}
          </div>
        </div>
      </div>
      <div
        class="mode"
        @click="handleMode('dark')"
        :style="
          mode == 'dark'
            ? { boxShadow: 'inset 0 0 0 1px rgba(116, 82, 255, 1)' }
            : {}
        "
      >
        <div
          class="check-box"
          :style="mode == 'dark' ? { backgroundColor: '#FFCB57' } : {}"
        />
        <div class="content">
          <div
            class="header bold-content-text"
            :style="mode == 'dark' ? { color: '#23106D' } : {}"
          >
            {{ text["appearance"]["darkMode"] }}
          </div>
          <div
            class="detail small-text"
            :style="mode == 'dark' ? { color: '#A58EFF' } : {}"
          >
            {{ text["appearance"]["darkSubHeader"] }}
          </div>
        </div>
      </div>
    </div>
    <div class="content-text title language">{{text['appearance']['language']}}</div>
    <div class="modes">
      <div
        class="mode"
        @click="changeLanguage('th')"
        :style="
          lang == 'th'
            ? { boxShadow: 'inset 0 0 0 1px rgba(116, 82, 255, 1)' }
            : {}
        "
      >
        <div
          class="check-box"
          :style="lang == 'th' ? { backgroundColor: '#FFCB57' } : {}"
        />
        <div class="content">
          <div
            class="header bold-content-text"
            :style="lang == 'th' ? { color: '#23106D' } : {}"
          >
            ภาษาไทย - Thai
          </div>
          <div
            class="detail small-text"
            :style="lang == 'th' ? { color: '#A58EFF' } : {}"
          >
            เนื้อหาต่าง ๆ ภายในเว็บไซต์จะแสดงเป็นภาษาไทย
          </div>
        </div>
      </div>
      <div
        class="mode"
        @click="changeLanguage('en')"
        :style="
          lang == 'en'
            ? { boxShadow: 'inset 0 0 0 1px rgba(116, 82, 255, 1)' }
            : {}
        "
      >
        <div
          class="check-box"
          :style="lang == 'en' ? { backgroundColor: '#FFCB57' } : {}"
        />
        <div class="content">
          <div
            class="header bold-content-text"
            :style="lang == 'en' ? { color: '#23106D' } : {}"
          >
            ภาษาอังกฤษ - English
          </div>
          <div
            class="detail small-text"
            :style="lang == 'th' ? { color: '#A58EFF' } : {}"
          >
            Every content in website will show in English
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppearanceSettingView",
  data() {
    return {
      text: null,
      lang: null,
      mode: "",
    };
  },
  methods: {
    copyLink(value) {
      let copyText = document.getElementById(value).innerHTML;
      navigator.clipboard.writeText(copyText);
    },
    handleMode(mode) {
      this.mode = mode;
      this.$cookies.set("mode", this.mode);
      window.location.reload();
    },
    changeLanguage(lang) {
      this.$cookies.set("lang", lang);
      window.location.reload();
    },
  },
  mounted() {
    this.$cookies.get("mode")
      ? (this.mode = this.$cookies.get("mode"))
      : (this.mode = "light");
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
.left-side {
  animation-name: appearsBottom;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  height: 100vh;
  background-color: $white;
  padding: 4.8rem 3.6rem;
  border-radius: 2.5rem;
  .language {
    margin-top: 3rem;
  }
  .title {
    color: $darkGrey;
    margin-bottom: 1.5rem;
  }
  .modes {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }
  .mode {
    width: 80%;
    height: 10rem;
    background-color: $primaryGrey;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    padding: 1.8rem 2.6rem;
    column-gap: 3rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: $grey;
    }
    .check-box {
      width: 2rem;
      height: 2rem;
      background-color: $white;
      border-radius: 0.5rem;
    }
    .content {
      display: flex;
      flex-direction: column;
      width: 70%;
      line-height: 1.6;
      .detail {
        color: $darkGrey;
      }
    }
  }
}
@media (max-width: 40em) {
  .left-side {
    height: auto;
    .mode {
      height: 15rem;
      width: 100%;
      .content {
        width: 80%;
      }
    }
  }
}
</style>
