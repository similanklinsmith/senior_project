<template>
  <div class="result-comp">
    <div class="row-header">
      <div class="bold-content-text">{{ response.dateTime }}</div>
      <BaseButton
        buttonType="common-button"
        btnText="Show schedule"
        textColor="white"
        textHover="white"
        color="#7452FF"
        hoverColor="#23106D"
        width="fit-content"
        @onClick="onClickShowSchedule"
      >
      </BaseButton>
    </div>
    <div class="result-detail">
      <div class="slot">
        <BaseButton
          buttonType="common-button"
          btnText="Accepted"
          textColor="white"
          textHover="white"
          color="#39CF5A"
          hoverColor="#39CF5A"
          width="15rem"
          fontSize="1.4rem"
          :style="'cursor: auto'"
        >
          <template v-slot:after-icon>
            <i class="fa-solid fa-check"></i>
          </template>
        </BaseButton>
        <div class="attendees">
          <div class="attendee-img">
            <div
              v-for="(res, index) in response.accepted.slice(0, 3)"
              :key="index"
              class="attendee"
              :style="'background-color:' + colorsList[index] + ';'"
            >
              <div class="small-content" style="color: white">
                {{ res.firstname.substring(0, 1) }}
              </div>
            </div>
            <div
              class="attendee"
              :style="'background-color: #C4C4C4'"
              v-if="response.accepted.length > 3"
            >
              <div class="small-content" style="color: white">
                {{ response.accepted.length - 3 }}+
              </div>
            </div>
          </div>
        </div>
        <div
          class="number-response small-text"
          @click="
            showAttendees('accepted', response.accepted, response.dateTime)
          "
        >
          {{ response.accepted.length }} responses
        </div>
      </div>
      <div class="slot">
        <BaseButton
          buttonType="common-button"
          btnText="Declined"
          textColor="white"
          textHover="white"
          color="#F33C3C"
          hoverColor="#F33C3C"
          width="15rem"
          fontSize="1.4rem"
          :style="'cursor: auto'"
        >
          <template v-slot:after-icon>
            <i class="fa-solid fa-xmark"></i>
          </template>
        </BaseButton>
        <div class="attendees">
          <div class="attendee-img">
            <div
              v-for="(res, index) in response.declined.slice(0, 3)"
              :key="index"
              class="attendee"
              :style="'background-color:' + colorsList[index - 1] + ';'"
            >
              <div class="small-content" style="color: white">
                {{ res.firstname.substring(0, 1) }}
              </div>
            </div>
            <div
              class="attendee"
              :style="'background-color: #C4C4C4'"
              v-if="response.declined.length > 3"
            >
              <div class="small-content" style="color: white">
                {{ response.declined.length - 3 }}+
              </div>
            </div>
          </div>
        </div>
        <div
          class="number-response small-text"
          @click="
            showAttendees('declined', response.declined, response.dateTime)
          "
        >
          {{ response.declined.length }} responses
        </div>
      </div>
      <div class="slot">
        <BaseButton
          buttonType="common-button"
          btnText="Not response"
          textColor="white"
          textHover="white"
          color="#C4C4C4"
          hoverColor="#C4C4C4"
          width="15rem"
          fontSize="1.4rem"
          :style="'cursor: auto'"
        >
        </BaseButton>
        <div class="attendees">
          <div class="attendee-img">
            <div
              v-for="(res, index) in response.notResponse.slice(0, 3)"
              :key="index"
              class="attendee"
              :style="'background-color:' + colorsList[index - 1] + ';'"
            >
              <div class="small-content" style="color: white">
                {{ res.firstname.substring(0, 1) }}
              </div>
            </div>
            <div
              class="attendee"
              :style="'background-color: #C4C4C4'"
              v-if="response.notResponse.length > 3"
            >
              <div class="small-content" style="color: white">
                {{ response.notResponse.length - 3 }}+
              </div>
            </div>
          </div>
        </div>
        <div
          class="number-response small-text"
          @click="
            showAttendees(
              'not-response',
              response.notResponse,
              response.dateTime
            )
          "
        >
          {{ response.notResponse.length }} responses
        </div>
      </div>
    </div>
    <teleport to="#portal-target" v-if="isShowAttendees">
      <div class="modal" @click="onClickCloseAttendees"></div>
      <div class="pop-up">
        <div class="remark-text">{{ showDateTime }}</div>
        <div
          class="bold-small-text"
          :style="
            label == 'Accepted'
              ? { color: '#39CF5A' }
              : label == 'Declined'
              ? { color: '#F33C3C' }
              : { color: '#C4C4C4' }
          "
        >
          {{ label }}<span> ({{ showAttendeeList.length }} responses)</span>
        </div>
        <div class="search-filter">
          <div class="input-icon">
            <i class="icon fa-solid fa-magnifying-glass"></i>
            <input
              class="small-text"
              type="text"
              placeholder="Search by name"
              v-model="searchInput"
            />
          </div>
        </div>
        <div class="pop-up-content">
          <div
            class="list-checkbox content-text"
            v-if="filterByName.length != 0"
          >
            <transition-group name="route">
              <div
                class="executive-checkbox"
                v-for="attendee in filterByName"
                :key="attendee.id"
              >
                <label :for="attendee.id">
                  <div class="profile-image">
                    <img
                      src="@/assets/decorations/sample_profile.png"
                      alt="sample profile illustration"
                    />
                  </div>
                  {{ attendee.title }}. {{ attendee.firstname }}
                  {{ attendee.lastname }}</label
                >
              </div>
            </transition-group>
          </div>
          <transition v-else name="route">
            <div class="remark-text not-found">Not Found</div>
          </transition>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import BaseButton from "../../components/UI/BaseButton.vue";
export default {
  name: "ResultComp",
  components: { BaseButton },
  props: ["response"],
  data() {
    return {
      colorsList: ["#23106D", "#7452FF", "#DBD2FF"],
      isShowAttendees: false,
      showAttendeeList: [],
      showDateTime: "",
      label: "",
      searchInput: "",
    };
  },
  computed: {
    filterByName() {
      return this.showAttendeeList.filter((attendee) => {
        return (
          attendee.firstname
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          attendee.lastname
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
        );
      });
    },
  },
  methods: {
    showAttendees(type, attendees, dateTime) {
      this.isShowAttendees = true;
      this.showDateTime = dateTime;
      switch (type) {
        case "accepted":
          this.label = "Accepted";
          break;
        case "declined":
          this.label = "Declined";
          break;
        case "not-response":
          this.label = "Not response";
          break;
        default:
          this.label = "Error";
          break;
      }
      this.showAttendeeList = [...attendees];
    },
    onClickCloseAttendees() {
      this.isShowAttendees = false;
      this.showAttendeeList = [];
    },
    onClickShowSchedule() {
      this.$emit('showSchedule', this.response.dateTime);
    }
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
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
.pop-up {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  z-index: 12;
  border-radius: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $white;
  width: 44rem;
  padding: 2.4rem 1.6rem;
  animation-name: appears;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  .image {
    transform: translateY(-3.6rem);
    img {
      width: 17.5rem;
    }
  }
  .remark-text {
    width: 100%;
    color: $primaryViolet;
    margin-bottom: 1rem;
    span {
      color: $darkGrey !important;
    }
  }
  .bold-small-text {
    width: 100%;
    margin-bottom: 1.2rem;
    span {
      color: $highlightViolet;
    }
  }
  .search-filter {
    margin-bottom: 1.5rem;
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-items: center;
    .input-icon {
      width: 100%;
      display: flex;
      align-items: center;
      justify-items: center;
      input[type="text"] {
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
      input::placeholder {
        font-size: 1.4rem;
        color: $darkGrey;
      }
      .icon {
        position: absolute;
        right: 0;
        font-size: 1.4rem;
        margin-right: 1rem;
        color: $darkGrey;
      }
    }
  }
  .pop-up-content {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    width: 100%;
    height: 30rem;
    overflow: scroll;
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $darkGrey;
      height: 100%;
    }
    .list-checkbox {
      width: 100%;
      display: flex;
      flex-direction: column;
      color: $darkViolet;
      row-gap: 1.5rem;
      .executive-checkbox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        label {
          display: flex;
          align-items: center;
          column-gap: 1.5rem;
        }
        input[type="checkbox"] {
          border-radius: 0.6rem;
          width: 2.4rem;
          height: 2.4rem;
          -webkit-appearance: none;
          box-shadow: inset 0 0 0 1px rgba(85, 85, 85, 0.25);
        }
        input[type="checkbox"]:checked {
          background-color: $yellow;
        }
        .profile-image {
          border-radius: 1rem;
          width: 5rem;
          height: 5rem;
          background-color: $fadedViolet;
          padding: 0.8rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .button-action {
    width: 100%;
    row-gap: 1rem;
  }
}
.result-comp {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  .row-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .bold-content-text {
      color: $darkViolet;
    }
  }
  .result-detail {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    .slot {
      display: flex;
      align-items: center;
      column-gap: 2rem;
      .number-response {
        color: $highlightViolet !important;
        cursor: pointer;
        transition: 0.2s all ease-in-out;
        &:hover {
          color: $primaryViolet !important;
        }
      }
      .attendees {
        display: flex;
        align-items: center;
        .attendee-img {
          display: flex;
          padding-top: 0.2rem;
          padding-bottom: 0.2rem;
          padding-left: 0.4rem;
          border-radius: 5rem;
          .attendee {
            width: 2.4rem;
            height: 2.4rem;
            border-radius: 50%;
            background-color: $primaryViolet;
            margin-right: -0.8rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
