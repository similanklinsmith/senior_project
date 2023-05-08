<template>
  <div class="compose-button">
    <teleport to="#portal-target" v-if="isShowComposeButton">
      <transition name="route" appear>
        <div class="modal" @click="toggleButton"></div>
      </transition>
      <transition name="route" appear>
        <div class="element-container">
          <span
            class="float-element"
            :style="
              isSelected == button.id ? { backgroundColor: '#23106D' } : {}
            "
            @click="onClick(button.id)"
            v-for="button in buttons"
            :key="button.id"
          >
            <div class="tooltip">{{ button.tooltip }}</div>
            <i :class="button.icon"></i>
          </span>
        </div>
      </transition>
    </teleport>
    <div
      class="mobile-button"
      @click="toggleButton"
      :style="
        !isShowComposeButton
          ? { backgroundColor: '#7452FF' }
          : { backgroundColor: '#FFFFFF', color: '#7452FF' }
      "
    >
      <span v-if="isShowComposeButton"><i class="fa-solid fa-xmark"></i></span
      ><span v-else><i class="fa-solid fa-bars"></i></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseComposeButton",
  props: ["buttons", "isShowComposeButton", "isSelected"],
  methods: {
    onClick(id) {this.$emit("onClick", id);},
    toggleButton() {this.$emit("toggleButton");},
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.modal {width: 100%;height: 100vh;position: fixed;background-color: rgba(24, 24, 26, 0.4);z-index: 5;display: flex;flex-direction: column;align-items: center;justify-content: center;}
.compose-button {z-index: 6;right: 0%;bottom: 0%;position: fixed;display: flex;flex-direction: column;row-gap: 2rem;.mobile-button {display: flex;justify-content: center;align-items: center;color: #ffffff;font-size: 2rem;width: 6.4rem;height: 6.4rem;border-radius: 1rem;box-shadow: 1.8rem 1.8rem 1.3rem 0 rgb(171 171 171 / 30%);transform: translateX(-5rem) translateY(-5rem);transition: 0.3s all ease-in-out;}.mobile-button:active {animation: press 0.2s 1 linear;}}
.element-container {z-index: 12;right: 0%;bottom: 0%;position: fixed;display: flex;row-gap: 2rem;flex-direction: column;transform: translateX(-5rem) translateY(-15rem);.float-element {display: flex;justify-content: center;align-items: center;color: $white;font-size: 2rem;width: 6.4rem;height: 6.4rem;border-radius: 1rem;box-shadow: 1.8rem 1.8rem 1.3rem 0 rgb(171 171 171 / 30%);background-color: $primaryViolet;position: relative;.tooltip {display: none;font-size: 1.6rem;position: fixed;transform: translateX(-9rem);width: fit-content;padding: 0.4rem 1.2rem;border-radius: 1rem;background-color: rgba(24, 24, 26, 0.75);}}.float-element:active {.tooltip {display: block;}}}
</style>
