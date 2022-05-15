<template>
  <div class="meeting-screen">
    <BaseHeader
      :headerText="`Create your own meeting`"
      :contentText="`You can easily create youe own meeting by clicking “Create meeting”`"
    >
    </BaseHeader>
    <div class="body">
      <div class="meeting-nav">
        <BaseButton
          btnText="Create poll meeting +"
          height="5rem"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          @onClick="onClickNav(1)"
          :class="isSelected == 1 ? 'common-button' : 'outlined-button'"
          :style="isSelected == 1 ? { color: 'white' } : { color: '#7452FF' }"
        >
        </BaseButton>
        <BaseButton
          buttonType="navigator-button"
          height="5rem"
          btnText="Inbox"
          textHover="white"
          hoverColor="#23106D"
          @onClick="onClickNav(2)"
          :style="
            isSelected == 2
              ? { backgroundColor: '#7452FF', color: 'white' }
              : { backgroundColor: '#F4F4F4', color: '#23106D' }
          "
        >
          <template v-slot:before-icon>
            <i class="fa-solid fa-inbox"></i>
          </template>
          <template v-slot:after-icon>
            <div class="badge">
              <div class="bold-smallest-text">2</div>
            </div>
          </template>
        </BaseButton>
        <BaseButton
          buttonType="navigator-button"
          height="5rem"
          btnText="Sent"
          textHover="white"
          hoverColor="#23106D"
          @onClick="onClickNav(3)"
          :style="
            isSelected == 3
              ? { backgroundColor: '#7452FF', color: 'white' }
              : { backgroundColor: '#F4F4F4', color: '#23106D' }
          "
        >
          <template v-slot:before-icon>
            <i class="fa-solid fa-paper-plane"></i>
          </template>
        </BaseButton>
        <BaseButton
          buttonType="navigator-button"
          height="5rem"
          btnText="To be confirmed"
          textHover="white"
          hoverColor="#23106D"
          @onClick="onClickNav(4)"
          :style="
            isSelected == 4
              ? { backgroundColor: '#7452FF', color: 'white' }
              : { backgroundColor: '#F4F4F4', color: '#23106D' }
          "
        >
          <template v-slot:before-icon>
            <i class="fa-solid fa-clipboard-list"></i>
          </template>
          <template v-slot:after-icon>
            <div class="badge">
              <div class="bold-smallest-text">3</div>
            </div>
          </template>
        </BaseButton>
        <BaseButton
          buttonType="navigator-button"
          height="5rem"
          btnText="Confirmed"
          textHover="white"
          hoverColor="#23106D"
          @onClick="onClickNav(5)"
          :style="
            isSelected == 5
              ? { backgroundColor: '#7452FF', color: 'white' }
              : { backgroundColor: '#F4F4F4', color: '#23106D' }
          "
        >
          <template v-slot:before-icon>
            <i class="fa-solid fa-square-check"></i>
          </template>
          <template v-slot:after-icon>
            <div class="badge">
              <div class="bold-smallest-text">1</div>
            </div>
          </template>
        </BaseButton>
        <BaseButton
          buttonType="navigator-button"
          height="5rem"
          btnText="Trash"
          textHover="white"
          hoverColor="#23106D"
          @onClick="onClickNav(6)"
          :style="
            isSelected == 6
              ? { backgroundColor: '#7452FF', color: 'white' }
              : { backgroundColor: '#F4F4F4', color: '#23106D' }
          "
        >
          <template v-slot:before-icon>
            <i class="fa-solid fa-trash"></i>
          </template>
        </BaseButton>
      </div>
      <transition-group name="route">
        <CreateMeetingView v-if="isSelected == 1" />
        <InboxView v-if="isSelected == 2" />
        <SentView v-if="isSelected == 3" />
        <BeConfirmedView v-if="isSelected == 4" />
        <ConfirmedView v-if="isSelected == 5" />
      </transition-group>
    </div>
  </div>
</template>

<script>
import CreateMeetingView from "./meeting/CreateMeetingView.vue";
import BeConfirmedView from "./meeting/BeConfirmedView.vue";
import ConfirmedView from "./meeting/ConfirmedView.vue";
import InboxView from "./meeting/InboxView.vue";
import SentView from "./meeting/SentView.vue";
import BaseButton from "../../components/UI/BaseButton.vue";
import BaseHeader from "../../components/UI/BaseHeader.vue";
export default {
  components: { BaseButton, BaseHeader, CreateMeetingView, BeConfirmedView, ConfirmedView, InboxView, SentView },
  data() {
    return {
      isSelected: 1,
    };
  },
  computed: {},
  methods: {
    onClickNav(num) {
      this.isSelected = num;
      localStorage.setItem("index",num)
    }
  },
  mounted() {
    this.isSelected = localStorage.getItem("index")
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.meeting-screen {
  .badge {
    padding: 0.6rem 0.8rem;
    background-color: $error;
    border-radius: 0.5rem;
    display: inline-block;
    color: $white;
    position: relative;
    font-size: 1rem;
  }
  .body {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 0.4fr 1.6fr;
    .meeting-nav {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: $white;
      padding: 3rem 2rem;
      row-gap: 1.6rem;
    }
    .first-body-section {
      padding: 3rem;
      width: 100%;
      height: 100%;
      .card-section {
        padding: 5rem 4.4rem;
        width: 100%;
        height: 100%;
        background-color: $white;
        border-radius: 2.5rem;
        display: grid;
        grid-template-columns: 0.5fr 1.5fr;
        .add-attendees {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          .bold-content-text {
            margin-bottom: 2rem;
          }
          .required-attendees {
            margin-bottom: 1.4rem;
          }
          .selected-attendees {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin-bottom: 1rem;
            .selected-attendee {
              margin-bottom: 1rem;
              .profile-section {
                display: flex;
                width: 100%;
                .profile-image {
                  border-radius: 1rem;
                  width: 3.5rem;
                  height: 3.5rem;
                  background-color: $fadedViolet;
                  margin-right: 0.5rem;
                  text-align: center;
                  padding: 0.2rem;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
          }
          .action-add {
            cursor: pointer;
            display: flex;
            color: $primaryViolet;
            align-items: center;
            column-gap: 0.8rem;
            transition: 0.2s all ease-in-out;
          }
          .action-add:hover {
            color: $highlightViolet;
          }
        }
        .add-details {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          row-gap: 2rem;
          .input-form-button {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
          .input-form-row {
            width: 100%;
            display: flex;
            column-gap: 2.4rem;
            .input {
              width: 100%;
            }
          }
          .input-form {
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          select,
          input[type="text"] {
            margin-top: 1rem;
            padding: 1rem 1.4rem;
            width: 100%;
            height: 4rem;
            border-radius: 0.5rem;
            border: none;
            background-color: $primaryGrey;
            font-family: "Poppins", sans-serif;
          }
          input[type="text"]:focus {
            outline: none;
            border: 0.1rem solid $primaryViolet;
          }
          select::placeholder,
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
  }
}
</style>
