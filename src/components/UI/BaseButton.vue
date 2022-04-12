<template>
  <div :class="buttonType" :style="style" @click="btnAction">
    <div class="content-text button-text">{{ btnText }}</div>
    <div class="content-text icon"><slot></slot></div>
  </div>
</template>

<script>
import "../../assets/colors/webColors.scss";
export default {
  props: [
    "btnText",
    "textColor",
    "textHover",
    "color",
    "hoverColor",
    "buttonType",
  ],
  data() {
    return {
      style: {
        "--color": this.color,
        "--hovercolor": this.hoverColor,
        "--textcolor": this.textColor,
        "--textHover": this.textHover,
      },
    };
  },
  methods: {
    btnAction() {
      return this.$emit("onClick");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.common-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.4rem 2rem;
  border-radius: 1rem;
  transition: 0.2s all ease-in-out;
  background-color: var(--color);
  .button-text {
    color: var(--textcolor);
    transition: 0.2s all ease-in-out;
    margin-right: 0.5rem;
  }
  .icon {
    color: var(--textcolor);
    transition: 0.2s all ease-in-out;
    font-size: 1.2rem;
  }
}
.common-button:hover {
  background-color: var(--hovercolor);
  .button-text {
    color: var(--textHover);
  }
  .icon {
    color: var(--textHover);
  }
}
.outlined-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.4rem 2rem;
  border-radius: 1rem;
  transition: 0.2s all ease-in-out;
  background-color: transparent;
  box-shadow: inset 0 0 0 1px var(--color);
  .button-text {
    color: var(--textcolor);
    transition: 0.2s all ease-in-out;
    margin-right: 0.5rem;
  }
  .icon {
    color: var(--textcolor);
    transition: 0.2s all ease-in-out;
    font-size: 1.2rem;
  }
}
.outlined-button:hover {
  box-shadow: none;
  background-color: var(--hovercolor);
  .button-text {
    color: var(--textHover);
  }
  .icon {
    color: var(--textHover);
  }
}
</style>
