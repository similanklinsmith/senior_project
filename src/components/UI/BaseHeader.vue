<template>
  <div class="header">
    <div class="line" />
    <div class="header-section grid">
      <div class="text">
        <div class="header-text">{{ headerText }}</div>
        <div class="thin-content-text">
          {{ contentText }}
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["headerText", "contentText"],
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.header {width: 100%;height: 15rem;background-color: $white;align-items: center;justify-content: center;.line {width: 90%;margin: 0 5%;height: 0.1rem;background-color: $grey;}.header-section {height: 100%;grid-template-columns: 2fr 0.5fr;padding: 3rem 5.5rem;align-items: center;justify-content: center;.text {.header-text {color: $darkViolet;margin-bottom: 1.4rem;}.thin-content-text {color: $highlightViolet;}}}}
@media (max-width: 33em) {
  .header {
    .header-section {
      .text {
        .thin-content-text {
          line-height: 1.4;
        }
      }
    }
  }
}
@media (max-width: 26.75em) {
  .header {
    height: 20rem;
    .header-section {
      padding: 3rem 4rem;
      grid-template-columns: 1fr;
    }
  }
}
</style>
