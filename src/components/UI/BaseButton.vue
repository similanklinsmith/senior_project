<template>
  <button :class="buttonType" :style="style" @click="btnAction" :type="type">
    <div class="content-text button-text">
      <div class="content-text icon"><slot name="before-icon"></slot></div>
      {{ btnText }}
    </div>
    <div class="content-text icon"><slot name="after-icon"></slot></div>
  </button>
</template>

<script>
import "../../assets/colors/webColors.scss";
export default {
  props: {
    btnText: String,
    textColor: String,
    textHover: String,
    color: String,
    hoverColor: String,
    buttonType: String,
    height: String,
    width: String,
    type: String
  },
  data() {
    return {
      style: {
        "--color": this.color,
        "--hovercolor": this.hoverColor,
        "--textcolor": this.textColor,
        "--textHover": this.textHover,
        "--height": this.height,
        "--width": this.width,
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
  width: var(--width) !important;
  height: var(--height) !important;
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
  width: var(--width) !important;
  height: var(--height) !important;
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
.navigator-button {
  width: var(--width) !important;
  height: var(--height) !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1.4rem 2rem;
  border-radius: 1rem;
  transition: 0.2s all ease-in-out;
  background-color: var(--color);
  .button-text {
    color: var(--textcolor);
    transition: 0.2s all ease-in-out;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon {
      margin-right: 0.5rem;
      color: var(--textcolor);
      transition: 0.2s all ease-in-out;
      font-size: 1.2rem;
    }
  }
}
.navigator-button:hover {
  background-color: var(--hovercolor) !important;
  .button-text {
    color: var(--textHover);
    .icon {
      color: var(--textHover);
    }
  }
}
.texted-button {
  width: var(--width) !important;
  height: var(--height);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.4rem 2rem;
  border-radius: 1rem;
  transition: 0.2s all ease-in-out;
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
.texted-button:hover {
  .button-text {
    color: var(--textHover);
  }
  .icon {
    color: var(--textHover);
  }
}
</style>