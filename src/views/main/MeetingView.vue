<template>
  <div>
    <div class="meeting-screen" v-if="!isMobile">
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
        <div class="meeting-nav-horizontal">
          <div class="slide">
            <BaseButton
              btnText="Create poll meeting +"
              height="5rem"
              minWidth="23rem"
              textHover="white"
              color="#7452FF"
              hoverColor="#23106D"
              @onClick="onClickNav(1)"
              :class="isSelected == 1 ? 'common-button' : 'outlined-button'"
              :style="
                isSelected == 1 ? { color: 'white' } : { color: '#7452FF' }
              "
            >
            </BaseButton>
            <BaseButton
              buttonType="navigator-button"
              height="5rem"
              minWidth="23rem"
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
              minWidth="23rem"
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
              minWidth="23rem"
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
              minWidth="23rem"
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
              minWidth="23rem"
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
    <div class="meeting-screen-mobile" v-else>
      <div class="compose-button">
        <teleport to="#portal-target" v-if="isShowComposeButton">
          <transition name="route" appear>
            <div class="modal" @click="isShowComposeButton = false"></div>
          </transition>
          <transition name="route" appear>
            <div class="element-container">
              <span
                class="float-element"
                v-if="isSelected != 1"
                @click="onClickNav(1)"
              >
                <div class="tooltip">Create poll meeting</div>
                <i class="fa-solid fa-plus"></i>
              </span>
              <span
                class="float-element"
                v-if="isSelected != 2"
                @click="onClickNav(2)"
              >
                <div class="tooltip">Inbox</div>
                <i class="fa-solid fa-inbox"></i>
              </span>
              <span
                class="float-element"
                v-if="isSelected != 3"
                @click="onClickNav(3)"
              >
                <div class="tooltip">Sent</div>
                <i class="fa-solid fa-paper-plane"></i>
              </span>
              <span
                class="float-element"
                v-if="isSelected != 4"
                @click="onClickNav(4)"
              >
                <div class="tooltip">To be confirmed</div>
                <i class="fa-solid fa-clipboard-list"></i>
              </span>
              <span
                class="float-element"
                v-if="isSelected != 5"
                @click="onClickNav(5)"
              >
                <div class="tooltip">Confirmed</div>
                <i class="fa-solid fa-square-check"></i>
              </span>
              <span
                class="float-element"
                v-if="isSelected != 6"
                @click="onClickNav(6)"
              >
                <div class="tooltip">Trash</div>
                <i class="fa-solid fa-trash"></i>
              </span>
            </div>
          </transition>
        </teleport>
        <div
          class="mobile-button"
          @click="isShowComposeButton = !isShowComposeButton"
          :style="
            !isShowComposeButton
              ? { backgroundColor: '#7452FF' }
              : { backgroundColor: '#FFFFFF', color: '#7452FF' }
          "
        >
          <span v-if="isShowComposeButton"
            ><i class="fa-solid fa-xmark"></i></span
          ><span v-else><i class="fa-solid fa-bars"></i></span>
        </div>
      </div>
      <!-- <div class="header remark-text">{{ showHeaderMobile }}</div> -->
      <CreateMeetingView v-if="isSelected == 1" />
      <InboxView v-if="isSelected == 2" />
      <SentViewMobile v-if="isSelected == 3" />
      <BeConfirmedView v-if="isSelected == 4" />
      <ConfirmedView v-if="isSelected == 5" />
    </div>
  </div>
</template>

<script>
import CreateMeetingView from "./meeting/CreateMeetingView.vue";
import BeConfirmedView from "./meeting/BeConfirmedView.vue";
import ConfirmedView from "./meeting/ConfirmedView.vue";
import InboxView from "./meeting/InboxView.vue";
import SentView from "./meeting/SentView.vue";
import SentViewMobile from "./meeting/mobile/SentViewMobile.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseHeader from "@/components/UI/BaseHeader.vue";
export default {
  components: {
    BaseButton,
    BaseHeader,
    CreateMeetingView,
    BeConfirmedView,
    ConfirmedView,
    InboxView,
    SentView,
    SentViewMobile
  },
  data() {
    return {
      isSelected: 1,
      isMobile: false,
      isShowComposeButton: false,
      headerMobile: "",
    };
  },
  computed: {
    showHeaderMobile() {
      switch (this.isSelected) {
        case 1:
          return "Create Meeting";
        case 2:
          return "Inbox";
        case 3:
          return "Sent";
        case 4:
          return "To be confirmed";
        case 5:
          return "Confirmed";
        case 6:
          return "Trash";
        default:
          return "Create Meeting";
      }
    },
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 428;
    },
    onClickNav(num) {
      this.isShowComposeButton = false;
      this.isSelected = num;
      localStorage.setItem("index", num);
    },
  },
  mounted() {
    this.isSelected = localStorage.getItem("index")
      ? localStorage.getItem("index")
      : 1;
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.modal {
  width: 100%;
  height: 100vh;
  position: fixed;
  background-color: rgba(24, 24, 26, 0.4);
  z-index: 11;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.element-container {
  z-index: 12;
  right: 0%;
  bottom: 0%;
  position: fixed;
  display: flex;
  row-gap: 2rem;
  flex-direction: column;
  transform: translateX(-5rem) translateY(-15rem);
  .float-element {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $white;
    font-size: 2rem;
    width: 6.4rem;
    height: 6.4rem;
    border-radius: 1rem;
    box-shadow: 1.8rem 1.8rem 1.3rem 0 rgb(171 171 171 / 30%);
    background-color: $primaryViolet;
    position: relative;
    .tooltip {
      display: none;
      font-size: 1.6rem;
      position: fixed;
      transform: translateX(-9rem);
      width: fit-content;
      padding: 0.4rem 1.2rem;
      border-radius: 1rem;
      background-color: rgba(24, 24, 26, 0.75);
    }
  }
  .float-element:active {
    .tooltip {
      display: block;
    }
  }
}
.meeting-screen-mobile {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  padding: 3rem;
  .compose-button {
    z-index: 12;
    right: 0%;
    bottom: 0%;
    position: fixed;
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
    .mobile-button {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-size: 2rem;
      width: 6.4rem;
      height: 6.4rem;
      border-radius: 1rem;
      box-shadow: 1.8rem 1.8rem 1.3rem 0 rgb(171 171 171 / 30%);
      transform: translateX(-5rem) translateY(-5rem);
      transition: 0.3s all ease-in-out;
    }
    .mobile-button:active {
      animation: press 0.2s 1 linear;
    }
  }
  .header {
    color: $darkViolet;
  }
}
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
    .meeting-nav-horizontal {
      width: 100%;
      height: 8rem;
      background-color: $white;
      display: none;
      padding: 0 2rem;
      overflow: hidden;
      .slide {
        width: 100%;
        display: flex;
        column-gap: 1.6rem;
        align-items: center;
        overflow-x: scroll;
      }
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
@media (max-width: 63.5em) {
  .meeting-screen {
    .body {
      display: block;
      position: relative;
      .meeting-nav {
        display: none;
      }
      .meeting-nav-horizontal {
        display: flex;
      }
    }
  }
}
</style>