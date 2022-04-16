<template>
  <div class="sign-in-screen">
    <div class="header">
      <div class="logo-text">
        <span class="primaryViolet">M</span>OMENT<span class="yellow">O</span
        ><span class="fadedViolet">.</span>
      </div>
      <div class="group-button">
        <BaseButton
          btnText="Sign in"
          width="14rem"
          textColor="#7452FF"
          textHover="#DBD2FF"
          color="#7452FF"
          hoverColor="#23106D"
          :class="isSignIn ? 'outlined-button' : 'texted-button'"
          @onClick="isSignIn = true"
        >
        </BaseButton>
        <BaseButton
          btnText="Sign up"
          width="14rem"
          textColor="#7452FF"
          textHover="#DBD2FF"
          color="#7452FF"
          hoverColor="#23106D"
          :class="isSignIn ? 'texted-button' : 'outlined-button'"
          @onClick="isSignIn = false"
        >
        </BaseButton>
      </div>
    </div>
    <div class="body"></div>
  </div>
</template>

<script>
import BaseButton from "../../components/UI/BaseButton.vue";
export default {
  components: { BaseButton },
  name: "SignInView",
  data() {
    return {
      isSignIn: true,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.sign-in-screen {
  width: 100%;
  height: 100vh;
  background-color: $white;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    justify-content: space-between;
    padding: 4.8rem 7.2rem;
    .logo-text {
      font-size: 3.6rem;
      font-weight: 600;
    }
    .group-button {
      display: flex;
      column-gap: 1rem;
    }
    .primaryViolet {
      color: $primaryViolet;
    }
    .yellow {
      color: $yellow;
    }
    .fadedViolet {
      color: $fadedViolet;
    }
  }
  .body {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
