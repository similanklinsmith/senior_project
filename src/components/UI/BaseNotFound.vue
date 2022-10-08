<template>
  <div class="remark-text flex-col-center loading-container">
    <div class="failed flex-col-center" v-if="isFailed">
      <div class="image">
        <img
          src="@/assets/decorations/not_found.png"
          alt="sending illustrations"
        />
      </div>
      <div class="header-fail">{{text['notFound']['header']}}</div>
      {{text['notFound']['subHeader']}}
        <BaseButton
          buttonType="common-button"
          :btnText="text['notFound']['back']"
          textColor="white"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          width="100%"
          @onClick="$router.back()"
        />
    </div>
    <div class="flex-col-center loading" v-else>{{text['notFound']['loading']}}</div>
  </div>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
export default {
  name: "BaseNotFound",
  components: { BaseButton },
  props: ["isFailed"],
  data() {
    return {
      text: null,
      lang: null,
    }
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
@media (max-width: 26.75em) {.loading-container {.failed {width: 60% !important;}}}
.loading-container {height: 100vh;.failed {width: 30%;text-align: center;row-gap:2rem;.header-fail {font-size: 4rem;font-weight: 600;color: $error;}.image {width: 20rem;height: 20rem;img {width: 100%;height: 100%;object-fit: contain;}}}}
.loading,.image {height: 100vh;color: $highlightViolet;animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}
</style>
