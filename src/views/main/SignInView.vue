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
      <div class="first-section">
        <lottie-player
          src="https://assets3.lottiefiles.com/packages/lf20_7z8wtyb0.json"
          background="transparent"
          speed="1"
          style="width: 500px; height: 500px"
          loop
          autoplay
        ></lottie-player>
      </div>
      <div class="second-section">
        <form @submit.prevent="handleSignIn" class="sign-in-form">
          <div class="input-form">
            <label for="email" class="bold-small-text"
              >Email<span class="required">* {{ errors.email }} </span></label
            >
            <input
              class="small-text"
              type="text"
              placeholder="Email"
              id="email"
              name="email"
              v-model="form.email"
            />
          </div>
          <div class="input-form">
            <label for="password" class="bold-small-text"
              >Password<span class="required"
                >* {{ errors.password }}</span
              ></label
            >
            <input
              class="small-text"
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              v-model="form.password"
            />
          </div>
          <div class="required"> {{ notFound }}</div>
          <div class="forget-password bold-small-text">Forget password?</div>
          <BaseButton
            buttonType="common-button"
            btnText="Sign in"
            textColor="white"
            textHover="white"
            color="#7452FF"
            hoverColor="#23106D"
            type="submit"
          >
          </BaseButton>
        </form>

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
      form: {
        email: "",
        password: "",
      },
      errors: {},
      notFound: ""
    };
  },
  methods: {
    handleSignIn() {
      this.emailIsValid
        ? delete this.errors.email
        : (this.errors.email = "Please inform e-mail correctly");
      this.passwordIsValid
        ? delete this.errors.password
        : (this.errors.password = "Please inform password correctly");
      if (Object.keys(this.errors).length == 0) {
        let user = {
          email: this.form.email,
          password: this.form.password,
        };
        this.loading = true;
        this.$store.dispatch("auth/login", user).then(
          () => {
            this.notFound = "";
            this.$router.push("/");
          },
          (err) => {
            this.form.password = "";
            console.log(err.response.status);
            if (err.response.status == 404) {
              this.notFound = "Email or Password is invalid";
            }
          }
        );
      }
    },
  },
  computed: {
    emailIsValid() {
      return (
        !!this.form.email &&
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
          this.form.email
        )
      );
    },
    passwordIsValid() {
      return !!this.form.password;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.required {
  color: $error;
  margin-left: 0.2rem;
  font-size: 1.4rem !important;
}
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
    grid-template-columns: 1.25fr 0.75fr;
    padding: 0 7.2rem;
    .first-section {
      display: flex;
      justify-content: center;
    }
    .second-section {
      display: flex;
      flex-direction: column;
      row-gap: 2.5rem;
      padding: 4.8rem 2rem;
      width: 90%;
      .sign-in-form {
        display: flex;
        flex-direction: column;
        row-gap: 2.5rem;
      }
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
        font-family: "Lato", sans-serif;
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
