<template>
  <div class="left-side grid">
    <div class="first-col-left">
      <div class="profile-image" v-if="!profileImage">
        <img
          src="@/assets/decorations/sample_profile.png"
          alt="sample profile illustration"
        />
      </div>
      <div class="real-profile-image" v-else>
        <img
          :src="profileImage"
          alt="profile of user"
          @error="
            $event.target.src =
              'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
          "
        />
      </div>
      <div class="remark-text">
        <span>{{ title }}</span> {{ name }}
      </div>
    </div>
    <div class="last-col-left" v-if="!isEdit">
      <div class="content-text title">Official Information</div>
      <div class="email">
        <div class="label bold-content-text">
          Display name
          <div @click="copyLink('name-value')">
            <i class="icon fa-regular fa-copy"></i>
          </div>
        </div>
        <div class="content-text" id="name-value">{{ name }}</div>
      </div>
      <div class="email">
        <div class="label bold-content-text">
          Email
          <div @click="copyLink('email-value')">
            <i class="icon fa-regular fa-copy"></i>
          </div>
        </div>
        <div class="content-text" id="email-value">
          {{ email }}
        </div>
      </div>
      <div class="phone">
        <div class="label bold-content-text">
          Phone number
          <div @click="copyLink('phone-value')">
            <i class="icon fa-regular fa-copy"></i>
          </div>
        </div>
        <div class="content-text" id="phone-value">
          <span v-if="phone">{{ phone }}</span
          ><span v-else>-</span>
        </div>
      </div>
      <div class="group-button">
        <BaseButton
          buttonType="outlined-button"
          btnText="Profile setting"
          textColor="#7452FF"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          width="100%"
          @onClick="goToMicrosoftAccount"
        >
          <template v-slot:before-icon>
            <i class="fa-brands fa-microsoft"></i>
          </template>
        </BaseButton>
        <BaseButton
          buttonType="common-button"
          btnText="Edit profile"
          textColor="white"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          width="100%"
          @onClick="isEdit = true"
        >
          <template v-slot:before-icon>
            <i class="icon fa-solid fa-pencil"></i>
          </template>
        </BaseButton>
      </div>
    </div>
    <div class="last-col-left" v-else>
      <div class="input-form">
        <label for="title" class="bold-small-text">Title</label>
        <select name="title" id="title">
          <option value="">none</option>
          <option
            v-for="(title, index) in $store.state.executiveTitle"
            :key="title"
            :value="index"
          >
            {{ title }}
          </option>
        </select>
      </div>
      <div class="input-form">
        <label for="name" class="bold-small-text">Display name</label>
        <input
          class="small-text readonly"
          type="text"
          placeholder="Name"
          id="name"
          name="name"
          :value="name"
          readonly
        />
      </div>
      <div class="input-form">
        <label for="email" class="bold-small-text">Email</label>
        <input
          class="small-text readonly"
          type="text"
          placeholder="Email"
          id="email"
          name="email"
          :value="email"
          readonly
        />
      </div>
      <div class="input-form">
        <label for="phone" class="bold-small-text">Phone number</label>
        <input
          class="small-text"
          type="tel"
          placeholder="e.g. 0810000000"
          id="phone"
          name="phone"
        />
      </div>
      <div class="group-button" style="width: 80%">
        <BaseButton
          buttonType="outlined-button"
          btnText="Cancel"
          textColor="#F33C3C"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="isEdit = false"
        >
        </BaseButton>
        <BaseButton
          buttonType="common-button"
          btnText="Confirm Edit"
          textColor="white"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          width="100%"
        >
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
import axios from "axios";
import jwtDecrypt from "@/helpers/jwtHelper";
import BaseButton from "@/components/UI/BaseButton.vue";
import BasePopup from "@/components/UI/BasePopup.vue";
import { mapGetters, mapActions } from "vuex";
import { getAuth, signOut } from "firebase/auth";
export default {
  name: "ProfileSettingView",
  components: {
    BaseButton,
    BasePopup,
  },
  data() {
    return {
      name: "",
      email: "",
      title: "",
      phone: "",
      profileImage: null,
      isEdit: false,
      isShowPopup: false,
      auth: null,
      statusCode: null,
    };
  },
  compmuted: {
    ...mapGetters(["getterExecutiveTitles"]),
  },
  methods: {
    ...mapActions(["getExecutiveTitle"]),
    copyLink(value) {
      let copyText = document.getElementById(value).innerHTML;
      navigator.clipboard.writeText(copyText);
    },
    goToMicrosoftAccount() {
      window.open("https://myaccount.microsoft.com/", "_blank");
    },
    async getProfileImage() {
      var accessToken = localStorage.getItem("accessToken");
      try {
        await axios
          .get("https://graph.microsoft.com/v1.0/me/photo/$value", {
            headers: {
              "content-type": "image/jpeg",
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: "blob",
          })
          .then((result) => {
            let blob = new Blob([result.data], { type: "image/jpeg" });
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => {
              var base64String = reader.result;
              this.profileImage = base64String
                .toString()
                .substr(base64String.toString().indexOf(", ") + 1);
            };
          });
      } catch (error) {
        this.statusCode = error.response.status;
        this.isShowPopup = true;
        if (this.statusCode == 401 && this.isShowPopup == false) {
          signOut(this.auth).then(() => {
            this.$router.push("/sign-in");
          });
          this.$store.dispatch("auth/logout");
        }
      }
    },
  },
  created() {
    this.getProfileImage();
    this.getExecutiveTitle();
  },
  mounted() {
    this.auth = getAuth();
    if (localStorage.getItem("user")) {
      this.name = `${jwtDecrypt(localStorage.getItem("user")).name}`;
      this.email = `${jwtDecrypt(localStorage.getItem("user")).email}`;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.left-side {
  animation-name: appearsBottom;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  height: 100vh;
  grid-template-columns: 0.75fr 1.25fr;
  background-color: $white;
  padding: 4.8rem 3.6rem;
  border-radius: 2.5rem;
  .first-col-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 2rem;
    .profile-image {
      border-radius: 2rem;
      width: 16rem;
      height: 16rem;
      background-color: $fadedViolet;
      text-align: center;
      padding: 2.4rem;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .real-profile-image {
      border-radius: 2rem;
      width: 16rem;
      height: 16rem;
      background-color: $fadedViolet;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .last-col-left {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    row-gap: 3rem;
    animation-name: appearsBottom;
    animation-duration: 0.5s;
    animation-iteration-count: 1;
    .group-button {
      display: flex;
      width: 100%;
      column-gap: 1.8rem;
    }
    .title {
      color: $darkGrey;
    }
    .email,
    .phone,
    .secretary {
      display: flex;
      flex-direction: column;
      row-gap: 1.2rem;
      .label {
        display: flex;
        align-items: center;
        .icon {
          color: $darkGrey;
          font-size: 1.8rem;
          margin-left: 0.5rem;
          cursor: pointer;
          transition: 0.2s all ease-in-out;
        }
        .icon:hover {
          color: $highlightViolet;
        }
      }
      .content-text {
        color: $primaryViolet;
      }
    }
    .input-form {
      width: 80%;
      display: flex;
      flex-direction: column;
      input[type="text"].readonly {
        background-color: $grey;
      }
      select,
      input[type="text"],
      input[type="tel"] {
        margin-top: 1rem;
        padding: 1rem 1.4rem;
        width: 100%;
        height: 4rem;
        border-radius: 0.5rem;
        border: none;
        background-color: $primaryGrey;
        font-family: "Poppins", sans-serif;
      }
      input[type="text"]:focus,
      input[type="tel"]:focus {
        outline: none;
        border: 0.1rem solid $primaryViolet;
      }
      input::placeholder {
        font-size: 1.4rem;
        color: $darkGrey;
      }
      select {
        font-size: 1.4rem;
      }
      select:focus {
        outline: none;
        border: 0.1rem solid $primaryViolet;
      }
    }
  }
}
</style>
