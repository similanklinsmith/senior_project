<template>
  <div class="remark-text flex-col-center loading-container">
    <div class="failed flex-col-center" v-if="isFailed">
      <div class="header-fail">OOPS!</div>
      <div class="image">
        <img
          src="@/assets/decorations/not_found.png"
          alt="sending illustrations"
        />
      </div>
      We can't seem to find the page you're looking for.
      <BaseButton
        buttonType="common-button"
        btnText="Go back"
        textColor="white"
        textHover="white"
        color="#7452FF"
        hoverColor="#23106D"
        width="100%"
        @onClick="$router.back()"
      >
      </BaseButton>
    </div>
    <div class="flex-col-center loading" v-else>Loading...</div>
  </div>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
export default {
  name: "BaseNotFound",
  components: { BaseButton },
  props: ["isFailed"],
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
@media (max-width: 26.75em) {.loading-container {.failed {width: 60% !important;}}}
.loading-container {height: 100vh;.failed {width: 30%;text-align: center;row-gap: 1rem;.header-fail {font-size: 4rem;font-weight: 600;color: $primaryViolet;}.image {width: 20rem;height: 20rem;img {width: 100%;height: 100%;object-fit: contain;}}}}
.loading {height: 100vh;color: $highlightViolet;animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}
</style>
