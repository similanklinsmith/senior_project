<template>
  <div class="notfound-screen">
    <div class="header">
      <div class="logo-text">
        <span class="primaryViolet">M</span>OMENT<span class="yellow">O</span
        ><span class="fadedViolet">.</span>
      </div>
    </div>
    <div class="body">
      <div class="notfound-content flex-col-center">
        <img
          src="../../assets/decorations/not_found.png"
          alt="not found illustration"
        />
        <div class="big-header-text">Opps!</div>
        <div class="remark-text">
          We can’t seem to find the page you’re looking for.
        </div>
        <BaseButton
          buttonType="common-button"
          btnText="Back to home"
          textColor="white"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          @onClick="$router.push('/')"
        >
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "../../components/UI/BaseButton.vue";
export default {
  components: { BaseButton },
  name: "NotFound",
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.notfound-screen {
  width: 100%;
  height: 100%;
  .header {
    padding: 4.8rem 7.2rem;
    .logo-text {
      font-size: 3.6rem;
      font-weight: 600;
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
    margin-top: 14rem;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .notfound-content {
      row-gap: 1.5rem;
      img {
        width: 30rem;
      }
      .big-header-text {
        color: $error;
      }
      .remark-text {
        text-align: center;
        width: 28rem;
      }
    }
  }
}
</style>
