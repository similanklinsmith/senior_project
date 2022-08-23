<template>
  <div class="left-side">
    <div class="content-text title">Appearances</div>
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
            Light Mode
          </div>
          <div
            class="detail small-text"
            :style="mode == 'light' ? { color: '#A58EFF' } : {}"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
            Dark Mode
          </div>
          <div
            class="detail small-text"
            :style="mode == 'dark' ? { color: '#A58EFF' } : {}"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
      localStorage.setItem("mode", this.mode);
      window.location.reload();
    },
  },
  mounted() {
    localStorage.getItem("mode")
      ? (this.mode = localStorage.getItem("mode"))
      : (this.mode = "light");
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
  .title {
    color: $darkGrey;
    margin-bottom: 1.5rem;
  }
  .modes {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
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
        width: 60%;
        line-height: 1.6;
        .detail {
          color: $darkGrey;
        }
      }
    }
  }
}
@media (max-width: 40em) {
  .left-side {
    height: auto;
    .modes {
      .mode {
        height: 15rem;
        width: 100%;
        .content {
          width: 80%;
        }
      }
    }
  }
}
</style>
