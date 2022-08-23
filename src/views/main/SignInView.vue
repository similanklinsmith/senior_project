<template>
  <div class="sign-in-screen">
    <div class="header">
      <div class="logo-text">
        <span class="primaryViolet">M</span>OMENT<span class="yellow">O</span
        ><span class="fadedViolet">.</span>
      </div>
    </div>
    <div class="body">
      <div class="first-section">
        <div class="display-text">
          <div class="big-header-text first">Let’s make</div>
          <div class="big-header-text second">
            your life <span class="violet">easier</span
            ><span class="yellow">.</span>
          </div>
        </div>
        <lottie-player
          class="lottie"
          src="https://assets3.lottiefiles.com/packages/lf20_7z8wtyb0.json"
          background="transparent"
          speed="1"
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
          <div class="required" v-if="notFound">{{ notFound }}</div>
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
          btnText="Sign in with Microsoft"
          textColor="#7452FF"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          @onClick="signInWithMicrosoft"
        >
          <template v-slot:before-icon>
            <i class="fa-brands fa-windows"></i>
          </template>
        </BaseButton>
      </div>
    </div>
    <BasePopup
      v-if="isShowPopup"
      @closeModal="isShowPopup = false"
      :image="require(`@/assets/decorations/delete_executive.png`)"
    >
      <template v-slot:popupContent>
        We apologize for the inconvenience due to disruption. Please try again.
        [Error: {{ statusCode }}]
      </template>
      <template v-slot:buttons>
        <BaseButton
          buttonType="common-button"
          btnText="Close"
          textColor="white"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="isShowPopup = false"
        >
        </BaseButton>
      </template>
    </BasePopup>
  </div>
</template>

<script>
import {
  getAuth,
  // GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import BaseButton from "@/components/UI/BaseButton.vue";
import BasePopup from "@/components/UI/BasePopup.vue";
export default {
  components: { BaseButton, BasePopup },
  name: "SignInView",
  data() {
    return {
      isSignIn: true,
      isShowPopup: false,
      form: {
        email: "",
        password: "",
      },
      errors: {},
      notFound: "",
      statusCode: "",
    };
  },
  methods: {
    // signInWithGoogle() {
    //   const provider = new GoogleAuthProvider();
    //   signInWithPopup(getAuth(), provider)
    //     .then((result) => {
    //       console.log(result);
    //       this.$store.state.getAuth.user = result.user;
    //       console.log(this.$store.state.getAuth.user);
    //       // send user data to BE
    //       this.$router.push("/");
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    signInWithMicrosoft() {
      // filter with own API
      const provider = new OAuthProvider("microsoft.com");
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          // User is signed in.
          // IdP data available in result.additionalUserInfo.profile.

          // Get the OAuth access token and ID Token
          const credential = OAuthProvider.credentialFromResult(result);
          const accessToken = credential.accessToken;
          const idToken = credential.idToken;
          console.log("------ACCESS TOKEN------");
          console.log(accessToken);
          localStorage.setItem('accessToken', accessToken);
          console.log("------ID TOKEN------");
          console.log(idToken);
          // console.log(jwtDecrypt(idToken));
          // localStorage.setItem("user", idToken)
          console.log("------GET ID TOKEN--------");
          getAuth().currentUser.getIdToken().then((result) => {
            console.log(result);
            localStorage.setItem("user", result)
          })
          this.$router.push("/");
        })
        .catch((error) => {
          // Handle error.
          console.log(error);
            this.isShowPopup = true;
            this.statusCode = error;
        });
    },
    handleSignIn() {
      // this.emailIsValid
      //   ? delete this.errors.email
      //   : (this.errors.email = "Please inform e-mail correctly");
      // this.passwordIsValid
      //   ? delete this.errors.password
      //   : (this.errors.password = "Please inform password correctly");
      // if (Object.keys(this.errors).length == 0) {
      //   let user = {
      //     email: this.form.email,
      //     password: this.form.password,
      //   };
      //   this.loading = true;
      //   this.$store.dispatch("auth/login", user).then(
      //     () => {
      //       this.notFound = "";
      //       this.$router.push("/");
      //     },
      //     (err) => {
      //       this.isShowPopup = true;
      //       this.form.password = "";
      //       console.log(err.response.status);
      //       if (err.response.status == 403 || err.response.status == 404) {
      //         this.notFound = "Email or Password is invalid";
      //       } else {
      //         this.isShowPopup = true;
      //         this.statusCode = err.response.status;
      //       }
      //     }
      //   );
      // }
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
@import "@/assets/colors/webColors.scss";
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
  position: fixed;
  overflow-y: scroll;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    height: fit-content;
    display: grid;
    grid-template-columns: 1.25fr 0.75fr;
    padding: 0 7.2rem;
    .first-section {
      display: flex;
      justify-content: center;
      .display-text {
        display: flex;
        flex-direction: column;
        row-gap: 1.6rem;
        & {
          transform: translateY(3rem);
          position: absolute;
          z-index: 1;
        }
        .first {
          transform: translateX(-10rem);
        }
        .second {
          .violet {
            color: $primaryViolet;
          }
          .yellow {
            color: $yellow;
          }
        }
      }
      .lottie {
        width: 60rem;
        height: 60rem;
      }
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
@media (max-width: 70em) {
  .sign-in-screen {
    .body {
      grid-template-columns: 1.1fr 0.9fr;
      .first-section {
        .lottie {
          width: 45rem;
          height: 45rem;
        }
      }
      .second-section {
        .or::before,
        .or::after {
          letter-spacing: -10%;
          content: "______";
        }
      }
    }
  }
}
@media (max-width: 63.5em) {
  .sign-in-screen {
    .body {
      grid-template-columns: 1fr 1fr;
      .first-section {
        .lottie {
          width: 40rem;
          height: 40rem;
          margin-top: 5rem;
        }
        .display-text {
          .first {
            transform: translateX(-5rem);
          }
        }
      }
      .second-section {
        width: 100%;
        padding: 4.8rem 0rem;
      }
    }
  }
}
@media (max-width: 48em) {
  .sign-in-screen {
    .body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      row-gap: 4.8rem;
      .first-section {
        width: 100%;
        .lottie {
          margin-top: 2rem;
        }
      }
      .second-section {
        width: 70%;
        padding: 4.8rem 0rem;
      }
    }
  }
}
@media (max-width: 26.75em) {
  input {
    height: 4.8rem !important;
  }
  .sign-in-screen {
    .body {
      .second-section {
        width: 100%;
        padding: 4.8rem 0rem;
      }
    }
  }
}
</style>
