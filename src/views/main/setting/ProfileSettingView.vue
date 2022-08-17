<template>
  <div class="left-side grid">
    <div class="first-col-left">
      <div class="real-profile-image">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt="profile of user"
          @error="
            $event.target.src =
              'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
          "
        />
      </div>
      <div class="remark-text">Ms. Elizabeth Deluxe</div>
    </div>
    <div class="last-col-left">
      <div class="content-text title">Official Information</div>
      <div class="email">
        <div class="label bold-content-text">
          Display name
          <div @click="copyLink('name-value')">
            <i class="icon fa-regular fa-copy"></i>
          </div>
        </div>
        <div class="content-text" id="name-value">NAME SURNAME</div>
      </div>
      <div class="email">
        <div class="label bold-content-text">
          Email
          <div @click="copyLink('email-value')">
            <i class="icon fa-regular fa-copy"></i>
          </div>
        </div>
        <div class="content-text" id="email-value">
          name.lastname@mail.kmutt.ac.th
        </div>
      </div>
      <div class="phone">
        <div class="label bold-content-text">
          Phone number
          <div @click="copyLink('phone-value')">
            <i class="icon fa-regular fa-copy"></i>
          </div>
        </div>
        <div class="content-text" id="phone-value">081-551-9283</div>
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
        >
          <template v-slot:before-icon>
            <i class="fa-brands fa-google"></i>
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
        >
          <template v-slot:before-icon>
            <i class="icon fa-solid fa-pencil"></i>
          </template>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
export default {
  name: "ProfileSettingView",
  components: {
    BaseButton,
  },
  methods: {
    copyLink(value) {
      let copyText = document.getElementById(value).innerHTML;
      navigator.clipboard.writeText(copyText);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.left-side {
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
    .group-button {
      display: flex;
      width: 100%;
      column-gap: 1.8rem;
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
  }
}
</style>
