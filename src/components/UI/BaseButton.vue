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
    minWidth: String,
    type: String,
    fontSize: String,
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
        "--minwidth": this.minWidth,
        "--fontSize": this.fontSize ? this.fontSize : "1.6rem",
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
.content-text {
  display: flex;
  font-size: var(--fontSize) !important;
  align-items: center;
  justify-content: center;
}
.common-button {
  min-width: var(--minwidth) !important;
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
    .icon {
      margin-right: 0.5rem;
    }
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
  min-width: var(--minwidth) !important;
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
    .icon {
      margin-right: 0.5rem;
    }
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
  min-width: var(--minwidth) !important;
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
    }
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
  height: var(--height);
  cursor: pointer;
  width: fit-content;
  margin: 1.8rem 0rem;
  transition: 0.2s all ease-in-out;
  .button-text {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 0.6rem;
    color: var(--textcolor);
    transition: 0.2s all ease-in-out;
    margin-right: 0.5rem;
    .icon {
      margin-right: 0.5rem;
    }
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

@media (max-width: 26.75em) {
  .content-text {
    font-size: var(--fontSize) !important;
    font-size: 2rem !important;
  }
  .common-button {
    padding: 1.8rem 2rem;
    .button-text {
      color: var(--textcolor);
      transition: 0.2s all ease-in-out;
      margin-right: 0.5rem;
      .icon {
        margin-right: 0.5rem;
      }
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
    min-width: var(--minwidth) !important;
    width: var(--width) !important;
    height: var(--height) !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1.8rem 2rem;
    border-radius: 1rem;
    transition: 0.2s all ease-in-out;
    background-color: transparent;
    box-shadow: inset 0 0 0 1px var(--color);
    .button-text {
      color: var(--textcolor);
      transition: 0.2s all ease-in-out;
      margin-right: 0.5rem;
      .icon {
        margin-right: 0.5rem;
      }
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
    min-width: var(--minwidth) !important;
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
      }
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
    height: var(--height);
    cursor: pointer;
    width: fit-content;
    margin: 1.8rem 0rem;
    transition: 0.2s all ease-in-out;
    .button-text {
      display: flex;
      align-items: center;
      justify-content: center;
      column-gap: 0.6rem;
      color: var(--textcolor);
      transition: 0.2s all ease-in-out;
      margin-right: 0.5rem;
      .icon {
        margin-right: 0.5rem;
      }
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
}
</style>
