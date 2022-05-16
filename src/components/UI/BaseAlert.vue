<template>
  <transition name="slide" appear>
    <div class="notifications">
      <div class="notification">
        <div
          class="noti-tab"
          :style="
            status == 'success'
              ? { backgroundColor: '#39CF5A' }
              : { backgroundColor: '#F33C3C' }
          "
        ></div>
        <i
          v-if="status == 'success'"
          class="fas fa-check-circle icon"
          :style="
            status == 'success' ? { color: '#39CF5A' } : { color: '#F33C3C' }
          "
        ></i>
        <i
          v-if="status == 'failed'"
          class="fa-solid fa-circle-xmark icon"
          :style="
            status == 'success' ? { color: '#39CF5A' } : { color: '#F33C3C' }
          "
        ></i>
        <div class="noti-text">
          <div
            class="noti-header"
            :style="
              status == 'success' ? { color: '#39CF5A' } : { color: '#F33C3C' }
            "
          >
            <span v-if="status == 'success'">Success</span
            ><span v-if="status == 'failed'">Failed</span>
          </div>
          <div class="noti-description">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "BaseAlert",
  props: ["status"],
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.notifications {
  position: fixed;
  background-color: $white;
  bottom: 0%;
  right: 0%;
  margin: 0 1.4rem 1.4rem 0;
  height: fit-content;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
.notification {
  display: flex;
  position: relative;
  height: 100%;
  align-items: center;
}
.notification .icon {
  margin-left: 2rem;
  font-size: 2.4rem;
}
.noti-tab {
  position: absolute;
  width: 0.6rem;
  height: 100%;
}
.noti-text {
  margin-left: 1rem;
  padding: 1.4rem 12rem 1.4rem 1.4rem;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: $darkGrey;
}
.noti-header {
  font-weight: 700;
  font-size: 1.4rem;
}
</style>
>
