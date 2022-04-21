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
    <div class="body">
      <div class="first-section">first</div>
      <div class="second-section">
        <div class="input-form">
          <label for="email" class="bold-small-text">Email</label>
          <input
            class="small-text"
            type="text"
            placeholder="Email"
            id="email"
            name="email"
          />
        </div>
        <div class="input-form">
          <label for="password" class="bold-small-text">Password</label>
          <input
            class="small-text"
            type="password"
            placeholder="Password"
            id="password"
            name="password"
          />
        </div>
        <div class="forget-password bold-small-text">Forget password?</div>
        <BaseButton
          buttonType="common-button"
          btnText="Sign in"
          textColor="white"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
        >
        </BaseButton>
        <div class="or thin-content-text">or continue with</div>
        <BaseButton
          buttonType="outlined-button"
          btnText="Sign up"
          textColor="#7452FF"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 0 7.2rem;
    .first-section {
    }
    .second-section {
      display: flex;
      flex-direction: column;
      row-gap: 2.5rem;
      padding: 4.8rem 2rem;
      width: 70%;
      .input-form {
        display: flex;
        flex-direction: column;
        input[type="text"],
        input[type="password"] {
          margin-top: 1rem;
          padding: 1rem 1.4rem;
          height: 4rem;
          border-radius: 0.5rem;
          border: none;
          background-color: $primaryGrey;
          font-family: "Poppins", sans-serif;
        }
        input[type="text"]:focus,
        input[type="password"]:focus {
          outline: none;
          border: 0.1rem solid $primaryViolet;
        }
        input::placeholder {
          font-size: 1.4rem;
          color: $darkGrey;
        }
      }
      .forget-password {
        text-align: right;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }
      .forget-password:hover {
        color: $primaryViolet;
      }
      .or {
        color: $darkGrey;
        width: 100%;
        text-align: center;
      }
      .or::before,
      .or::after {
        letter-spacing: -10%;
        content: "______________";
      }
    }
  }
}
</style>
