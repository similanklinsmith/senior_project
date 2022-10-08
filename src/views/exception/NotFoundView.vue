<template>
  <div class="notfound-screen">
    <div class="header">
      <div class="logo-text">
        <span class="primaryViolet">M</span>OMENT<span class="yellow">O</span
        ><span class="fadedViolet">.</span>
      </div>
    </div>
    <div class="body">
      <div class="notfound-content flex-col-center">
        <img
          src="@/assets/decorations/not_found.png"
          alt="not found illustration"
        />
        <div class="big-header-text">{{text["notFound"]["header"]}}</div>
        <div class="remark-text">
          {{text["notFound"]["subHeader"]}}
        </div>
        <BaseButton
          buttonType="common-button"
          :btnText="text['notFound']['backHome']"
          textColor="white"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          @onClick="$router.push('/')"
        >
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
export default {
  components: { BaseButton },
  name: "NotFound",
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
.notfound-screen {width: 100%;height: 100vh;background-color: $white;display: flex;flex-direction: column;.header {padding: 4.8rem 7.2rem;.logo-text {font-size: 3.6rem;font-weight: 600;}.primaryViolet {color: $primaryViolet;}.yellow {color: $yellow;}.fadedViolet {color: $fadedViolet;}}.body {width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;.notfound-content {row-gap: 1.5rem;img {width: 30rem;animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.big-header-text {color: $error;}.remark-text {text-align: center;width: 28rem;}}}}
@media (max-width: 26.75em) {.notfound-screen {.body {.notfound-content {row-gap: 2.8rem;.remark-text {width: 32rem;}}}}}
</style>
