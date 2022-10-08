<template>
  <div class="pop-up flex-col-center" v-if="!isLoaded">
    <div class="flex-col-center">
      <div class="logo header-text">
        <span class="primary-violet">M</span>OMENT<span class="yellow">O</span
        ><span class="faded-violet">.</span>
      </div>
      <div class="image">
        <img
          src="@/assets/decorations/splash.png"
          alt="splash illustrations"
        />
      </div>
      <div class="remark-text">{{text['splash']['wait']}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: null,
      lang: null,
      isLoaded: false,
    };
  },
  mounted() {
    document.onreadystatechange = () => {
      if (document.readyState == "complete") {
        this.isLoaded = true;
      }
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
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
.pop-up {width: 100%;height: 100%;position: fixed;z-index: 12;background-color: $darkViolet;padding: 2.4rem 1.6rem;color: $white;.flex-col-center {animation-name: floating;-webkit-animation-name: floating;animation-duration: 2s;-webkit-animation-duration: 2s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.logo {.primary-violet {color: $primaryViolet;}.yellow {color: $yellow;}.faded-violet {color: $fadedViolet;}}.image {width: 15rem;height: 15rem;img {width: 100%;height: 100%;}}}
</style>
