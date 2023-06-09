<template>
  <div class="left-side">
    <div class="left-side-container grid" v-if="getterMyProfile">
      <div class="first-col-left">
        <div class="profile-image" v-if="!$store.state.myProfilePic">
          <img
            src="@/assets/decorations/sample_profile.png"
            alt="sample profile illustration"
          />
        </div>
        <div class="real-profile-image" v-else>
          <img
            :src="$store.state.myProfilePic"
            alt="profile of user"
            @error="
              $event.target.src =
                'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
            "
          />
        </div>
        <div class="remark-text">
          <span>{{ getterMyProfile.title_code }}</span>
          {{ getterMyProfile.name }}
        </div>
      </div>
      <div class="last-col-left" v-if="!isEdit">
        <div class="content-text title">
          {{ text["profileSetting"]["information"] }}
        </div>
        <div class="email">
          <div class="label bold-content-text">
            {{ text["profileSetting"]["disName"] }}
            <div @click="copyLink('name-value')">
              <i class="icon fa-regular fa-copy"></i>
            </div>
          </div>
          <div class="content-text" id="name-value">
            {{ getterMyProfile.name }}
          </div>
        </div>
        <div class="email">
          <div class="label bold-content-text">
            {{ text["profileSetting"]["email"] }}
            <div @click="copyLink('email-value')">
              <i class="icon fa-regular fa-copy"></i>
            </div>
          </div>
          <div class="content-text" id="email-value">
            {{ getterMyProfile.email }}
          </div>
        </div>
        <div class="phone">
          <div class="label bold-content-text">
            {{ text["profileSetting"]["phone"] }}
            <div @click="copyLink('phone-value')">
              <i class="icon fa-regular fa-copy"></i>
            </div>
          </div>
          <div class="content-text" id="phone-value">
            <span>{{
              getterMyProfile.phone_number ? getterMyProfile.phone_number : "-"
            }}</span>
          </div>
        </div>
        <div class="group-button">
          <BaseButton
            buttonType="outlined-button"
            :btnText="text['profileSetting']['microsoftBtn']"
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
            :btnText="text['profileSetting']['editBtn']"
            textColor="white"
            textHover="white"
            color="#7452FF"
            hoverColor="#23106D"
            width="100%"
            @onClick="onClickEditProfile"
          >
            <template v-slot:before-icon>
              <i class="icon fa-solid fa-pencil"></i>
            </template>
          </BaseButton>
        </div>
      </div>
      <div class="last-col-left is_edit" v-else>
        <div class="input-form">
          <label for="title" class="bold-small-text">{{
            text["profileSetting"]["title"]
          }}</label>
          <select name="title" id="title" v-model="form.title_code">
            <option :value="null">{{ text["input"]["none"] }}</option>
            <option
              v-for="(title, index) in getterSecretaryTitles"
              :key="title"
              :value="index"
            >
              {{ title }}
            </option>
          </select>
        </div>
        <div class="input-form">
          <label for="name" class="bold-small-text">{{
            text["profileSetting"]["disName"]
          }}</label>
          <input
            class="small-text"
            type="text"
            :placeholder="text['profileSetting']['disName']"
            id="name"
            name="name"
            v-model="form.display_name"
          />
        </div>
        <div class="input-form">
          <label for="email" class="bold-small-text">{{
            text["profileSetting"]["email"]
          }}</label>
          <input
            class="small-text readonly"
            type="text"
            placeholder="Email"
            id="email"
            name="email"
            :value="getterMyProfile.email"
            readonly
          />
        </div>
        <div class="input-form">
          <label for="phone" class="bold-small-text">{{
            text["profileSetting"]["phone"]
          }}</label>
          <input
            class="small-text"
            type="tel"
            placeholder="e.g. 0810000000"
            id="phone"
            name="phone"
            v-model="form.phone_number"
          />
        </div>
        <div class="group-button" style="width: 80%">
          <BaseButton
            buttonType="outlined-button"
            :btnText="text['profileSetting']['cancel']"
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
            :btnText="text['profileSetting']['confirm']"
            textColor="white"
            textHover="white"
            color="#7452FF"
            hoverColor="#23106D"
            width="100%"
            @onClick="handleEditProfile"
          >
          </BaseButton>
        </div>
      </div>
    </div>
    <div v-else class="loading remark-text">{{text['notFound']['loading']}}</div>
  </div>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ProfileSettingView",
  components: {
    BaseButton,
  },
  data() {
    return {
      text: null,
      lang: null,
      isEdit: false,
      secretaryId: null,
      form: {
        title_code: null,
        display_name: "",
        phone_number: null,
      },
    };
  },
  computed: {
    ...mapGetters(["getterSecretaryTitles", "getterMyProfile"]),
  },
  methods: {
    ...mapActions(["getSecretaryTitle", "getProfileImage", "getMyProfile"]),
    copyLink(value) {
      let copyText = document.getElementById(value).innerHTML;
      navigator.clipboard.writeText(copyText);
    },
    goToMicrosoftAccount() {
      window.open("https://myaccount.microsoft.com/", "_blank");
    },
    onClickEditProfile() {
      this.isEdit = true;
      this.form.title_code = this.getterMyProfile.title_code;
      this.form.display_name = this.getterMyProfile.name;
      this.form.phone_number = this.getterMyProfile.phone_number;
    },
    async handleEditProfile() {
      await this.$store.dispatch("updateProfile", this.form);
      this.isEdit = false;
    },
  },
  created() {
    this.getProfileImage();
    this.getSecretaryTitle();
    this.getMyProfile();
  },
  beforeMount() {
    if (this.$cookies.get("lang")) {
      this.lang = this.$cookies.get("lang");
    } else {
      this.lang = "en";
    }
    this.text = require(`@/assets/langs/${this.lang}.json`);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.left-side {animation-name: appearsBottom;animation-duration: 0.5s;animation-iteration-count: 1;height: 100vh;background-color: $white;padding: 4.8rem 3.6rem;border-radius: 2.5rem;.loading {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 80%;text-align: center;color: $darkGrey;animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}}
.left-side-container {grid-template-columns: 0.75fr 1.25fr;.first-col-left {display: flex;flex-direction: column;align-items: center;row-gap: 2rem;.profile-image {border-radius: 2rem;width: 16rem;height: 16rem;background-color: $fadedViolet;text-align: center;padding: 2.4rem;img {width: 100%;height: 100%;object-fit: contain;}}.real-profile-image {border-radius: 2rem;width: 16rem;height: 16rem;background-color: $fadedViolet;overflow: hidden;img {width: 100%;height: 100%;object-fit: cover;}}}.last-col-left {display: flex;flex-direction: column;justify-content: flex-start;row-gap: 3rem;animation-name: appearsBottom;animation-duration: 0.5s;animation-iteration-count: 1;.group-button {display: flex;width: 100%;column-gap: 1.8rem;}.title {color: $darkGrey;}.email,.phone,.secretary {display: flex;flex-direction: column;row-gap: 1.2rem;.label {display: flex;align-items: center;.icon {color: $darkGrey;font-size: 1.8rem;margin-left: 0.5rem;cursor: pointer;transition: 0.2s all ease-in-out;}.icon:hover {color: $highlightViolet;}}.content-text {color: $primaryViolet;}}.input-form {width: 80%;display: flex;flex-direction: column;input[type="text"].readonly {background-color: $grey;}select,input[type="text"],input[type="tel"] {margin-top: 1rem;padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input[type="text"]:focus,input[type="tel"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}select {font-size: 1.4rem;}select:focus {outline: none;border: 0.1rem solid $primaryViolet;}}}}
@media (max-width: 40em) {.left-side-container {display: flex;flex-direction: column;row-gap: 2rem;height: auto;.last-col-left.is_edit {align-items: center;}}}
</style>
