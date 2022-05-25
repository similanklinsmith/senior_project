<template>
  <div class="infscroll__container">
    <div id="infinite-list" class="infscroll__items">
      <transition name="route" appear>
        <div class="infscroll__loader-bg" v-show="showLoading">
          <div class="infscroll__loader">{{ textLoading }}</div>
        </div>
      </transition>
      <slot></slot>
      <BaseButton
        v-if="maximum != length"
        buttonType="common-button"
        btnText="Load more"
        textColor="white"
        textHover="white"
        color="#7452FF"
        hoverColor="#23106D"
        width="100%"
        @onClick="loadMore()"
      >
      </BaseButton>
    </div>
  </div>
</template>
<script>
import BaseButton from "@/components/UI/BaseButton.vue";
export default {
  name: "InfiniteScroll",
  components: {
    BaseButton,
  },

  props: {
    showLoading: {
      type: Boolean,
      default: false,
    },
    textLoading: {
      type: String,
      default: "Loading ...",
    },
    maximum: {
      type: Number,
    },
    length: {
      type: Number,
    },
  },

  data() {
    return {
      isMobile: false,
    };
  },

  mounted() {
    const listElm = document.querySelector("#infinite-list");
    listElm.addEventListener("scroll", () => {
      //   if (
      //     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      //       navigator.userAgent
      //     )
      //   ) {
      //     if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
      //       this.isMobile = true;
      //     }
      //   } else {
      if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
        this.loadMore();
      }
      //   }
    });
  },

  methods: {
    loadMore() {
      this.$emit("loadMore");
    },
  },
};
</script>
<style lang="scss" scoped></style>
