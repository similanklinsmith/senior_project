<template>
  <div class="portals">
    <teleport to="#portal-target">
      <div class="modal" @click="closeModal"></div>
      <div class="pop-up">
        <div class="image">
          <img
            :src="image"
            alt="popup illustration"
          />
        </div>
        <div class="pop-up-content flex-col-center">
          <div class="remark-text">
            <slot name="popupContent"></slot>
          </div>
        </div>
        <div class="button-action flex-col-center">
          <slot name="buttons"></slot>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
export default {
  props:["image"],
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.modal{width:100%;height:100vh;position:fixed;background-color:rgba(24,24,26,0.4);z-index:11;display:flex;flex-direction:column;align-items:center;justify-content:center}.pop-up{top:50%;left:50%;transform:translate(-50%,-50%);position:fixed;z-index:12;border-radius:2.5rem;display:flex;flex-direction:column;align-items:center;background-color:$white;width:44rem;padding:2.4rem 1.6rem;animation-name:appears;animation-duration:.5s;animation-iteration-count:1;.image{transform:translateY(-3.6rem);img{width:17.5rem}}.pop-up-content{text-align:center;margin-bottom:1rem;.remark-text{span{color:$darkGrey !important}}}.button-action{width:100%;row-gap:1rem}}
@keyframes appears {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
