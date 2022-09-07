<template>
  <div class="to-be-confirmed-body-section">
    <div class="inbox">
      <div class="filter">
        <div class="search-filter">
          <div class="input-icon">
            <i class="icon fa-solid fa-magnifying-glass"></i>
            <input
              id="search-input"
              class="small-text"
              type="text"
              placeholder="Search by title"
              v-model="searchInput"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>
        </div>
        <div class="filter-list" @click="toggleDropdown">
          <i class="fa-solid fa-filter icon"></i>
          <div class="alert" v-if="filterDate"></div>
        </div>
        <div
          class="dropdown__content"
          :class="`${isShowDropdown ? 'is-show' : ''}`"
        >
          <ul>
            <li>
              <div class="input">
                <label for="due" class="bold-small-text">Date within</label>
                <litepie-datepicker
                  id="due"
                  as-single
                  :formatter="formatter"
                  v-model="withInDate"
                  :style="{ fontSize: '12px !important', marginTop: '1rem' }"
                />
              </div>
            </li>
            <li>
              <BaseButton
                buttonType="common-button"
                btnText="Search"
                textColor="#23106D"
                textHover="#23106D"
                color="#DBD2FF"
                hoverColor="#A58EFF"
                width="100%"
                @onClick="handleFilterDate"
              >
              </BaseButton>
            </li>
          </ul>
        </div>
      </div>
      <div class="filter-show">
        <div class="small-text">
          <span v-if="filterDate">With in: {{ filterDate }}</span>
        </div>
        <div class="small-text">Results: {{ filterByTitle.length }}</div>
      </div>
      <div class="inbox-list">
        <transition-group name="route">
          <InboxComp
            v-for="inbox in filterByTitle"
            :key="inbox.id"
            :id="inbox.id"
            :title="inbox.title"
            :content="'need to answer poll appointment'"
            :time="inbox.create_at"
            :selectedId="selectedId"
            @selectInbox="selectInbox"
          />
          <div v-if="filterByTitle.length == 0" class="remark-text not-found">
            Not found
          </div>
        </transition-group>
      </div>
    </div>
    <transition name="route">
      <div v-if="selectedId != null">
        <div class="inbox-detail">
          <div
            class="inbox-detail-content"
            v-if="isLoading == false && inboxDetail != null"
          >
            <div class="title remark-text">{{ inboxDetail.title }}</div>
            <div class="sent-from smallest-text">
              sent on {{ formatDateTime(inboxDetail.create_at) }} by
              <span>{{ inboxDetail.secretary.name }}</span>
              &lt;{{ inboxDetail.secretary.email }}&gt;
            </div>
            <div class="bold-small-text due-date">
              <span>*</span>This form will be expired in
              {{ inboxDetail.due_date_time.split("T")[0] }}
              <span v-if="new Date(inboxDetail.due_date_time) >= new Date()"
                >({{ calculateRemainingDay(inboxDetail.due_date_time) }} days
                left)</span
              >
              <span v-else>(Already expired)</span>
            </div>
            <div
              class="response"
              :class="`${
                new Date(inboxDetail.due_date_time) < new Date()
                  ? 'expired'
                  : ''
              }`"
            >
              <div
                class="response-container"
                v-for="(periodOfTime, index) in inboxDetail.periodOfTime"
                :key="index"
              >
                <div class="day bold-content-text">
                  {{ formatDateTimeHeader(periodOfTime.date) }}
                </div>
                <ResponseComp
                  @onResponse="handleResponse"
                  v-for="executive in periodOfTime.executives"
                  :key="executive.executive_id"
                  :executive="executive"
                  :date="periodOfTime.date"
                  :duration="inboxDetail.duration_of_time"
                  :dateTimeHeader="formatDateTimeHeader(periodOfTime.date)"
                />
              </div>
            </div>
            <div class="button">
              <BaseButton
                v-if="responseAll"
                buttonType="common-button"
                btnText="Confirm response"
                textColor="white"
                textHover="white"
                color="#7452FF"
                hoverColor="#23106D"
                width="24rem"
                @onClick="confirmResponse"
              >
              </BaseButton>
            </div>
          </div>
          <div v-else class="remark-text not-found loading">Loading...</div>
        </div>
      </div>
    </transition>
    <BaseAlert v-if="getterSuccess" :status="`success`">
      Answer is succesfully sent
    </BaseAlert>
    <BaseAlert v-if="getterFailed" :status="`failed`">
      Answer is failed to sent
    </BaseAlert>
  </div>
</template>

<script>
import InboxComp from "@/components/meeting/InboxComp.vue";
import ResponseComp from "@/components/meeting/ResponseComp.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import LitepieDatepicker from "litepie-datepicker";
import BaseAlert from "@/components/UI/BaseAlert.vue";
import { mapGetters, mapActions } from "vuex";
import {
  formatDateTimeDetail,
  formatDateTimeHeader,
} from "@/helpers/formatDateTime";
import { ref } from "vue";
export default {
  name: "BeConfirmedView",
  components: {
    InboxComp,
    ResponseComp,
    BaseButton,
    LitepieDatepicker,
    BaseAlert,
  },
  setup() {
    const formatter = ref({
      date: "YYYY-MM-DD",
      month: "MMM",
    });
    return {
      formatter,
    };
  },
  data() {
    return {
      searchInput: "",
      isShowDropdown: false,
      withInDate: "",
      filterDate: "",
      toBeConfirmedList: [],
      inboxDetail: null,
      selectedId: null,
      isLoading: false,
      dataToBe: {},
      response: [],
    };
  },
  computed: {
    ...mapGetters([
      "getterMyBeConfirmeds",
      "getterMyBeConfirmedDetail",
      "getterSuccess",
      "getterFailed",
    ]),
    getBeConfirmedList() {
      return this.$store.getters.getterMyBeConfirmeds;
    },
    filterByTitle() {
      return this.getBeConfirmedList.filter((toBeConfirmed) => {
        if (this.filterDate) {
          return (
            toBeConfirmed.title
              .toLowerCase()
              .includes(this.searchInput.toLowerCase()) &&
            new Date(
              toBeConfirmed.create_at.split("T")[0]
            ).toLocaleDateString() ==
              new Date(this.filterDate).toLocaleDateString()
          );
        } else {
          return toBeConfirmed.title
            .toLowerCase()
            .includes(this.searchInput.toLowerCase());
        }
      });
    },
    responseAll() {
      var isValid = false;
      if (
        this.response.length > 0 &&
        this.response.length ==
          this.inboxDetail.periodOfTime[0].executives.length
      ) {
        for (let index = 0; index < this.response.length; index++) {
          isValid =
            this.response[index].timeSlot.length ==
            this.inboxDetail.periodOfTime.length;
          if (isValid == false) {
            return false;
          }
          for (let i = 0; i < this.response[index].timeSlot.length; i++) {
            if (this.response[index].timeSlot[i].status == "accepted") {
              isValid =
                this.response[index].timeSlot[i].preferredTime.length != 0;
              if (isValid == false) {
                return isValid;
              }
            }
          }
        }
        return isValid;
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["getMyBeConfirmeds", "getMyBeConfirmedDetail"]),
    onFocus() {
      document.getElementById("search-input").placeholder = "Type to find...";
    },
    onBlur() {
      document.getElementById("search-input").placeholder = "Search by title";
    },
    toggleDropdown() {
      this.isShowDropdown = !this.isShowDropdown;
    },
    handleFilterDate() {
      this.filterDate =
        this.withInDate ?? new Date(this.withInDate).toLocaleDateString();
      this.isShowDropdown = false;
      this.selectedInbox = null;
    },
    calculateRemainingDay(date) {
      return Math.round(
        (new Date(date) - new Date(Date.now())) / (24 * 60 * 60 * 1000)
      ) < 0
        ? 0
        : Math.round(
            (new Date(date) - new Date(Date.now())) / (24 * 60 * 60 * 1000)
          );
    },
    handleResponse(answer) {
      if (this.response.length > 0) {
        const index = this.response.findIndex(
          (res) => res.executiveId == answer.executiveId
        );
        if (index != -1) {
          const indexDate = this.response[index].timeSlot.findIndex(
            (slot) => slot.date == answer.timeSlot[0].date
          );
          if (indexDate != -1) {
            console.log(answer.timeSlot[0].preferredTime);
            this.response[index].timeSlot[indexDate].preferredTime =
              answer.timeSlot[0].preferredTime;
          } else {
            this.response[index].timeSlot.push(answer.timeSlot[0]);
          }
        } else {
          this.response.push(answer);
        }
      } else {
        this.response.push(answer);
      }
    },
    async confirmResponse() {
      this.dataToBe.responses = this.response;
      await this.$store.dispatch("replyToBeConfirmed", this.dataToBe);
      this.dataToBe.id = null;
      this.selectedId = null;
      this.inboxDetail = null;
    },
    formatDateTime(dateTime) {
      return formatDateTimeDetail(dateTime);
    },
    formatDateTimeHeader(dateTime) {
      return formatDateTimeHeader(dateTime);
    },
    async selectInbox(id) {
      this.dataToBe.id = id;
      this.selectedId = id;
      this.isLoading = true;
      try {
        this.inboxDetail = await this.$store.dispatch(
          "getMyBeConfirmedDetail",
          this.selectedId
        );
        console.log(this.inboxDetail);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.getMyBeConfirmeds();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
ul {
  width: 100%;
  list-style: none;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  li {
    color: $darkViolet;
    transition: 0.3s all ease-in-out;
  }
}
.expired {
  filter: grayscale(1);
  opacity: 0.5;
  pointer-events: none;
}
.response {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 50rem;
  overflow: scroll;
  margin: 1rem 0;
  padding: 0 1rem;
  .response-container {
    margin: 2.5rem 0;
    .day {
      color: $darkViolet;
    }
  }
}
.response::-webkit-scrollbar {
  display: block !important;
  -ms-overflow-style: auto !important;
  scrollbar-width: auto !important;
  background-color: transparent;
  width: 1rem;
}
.response::-webkit-scrollbar-track {
  margin: 1rem;
  border-radius: 0.5rem;
}
.response::-webkit-scrollbar-thumb {
  background-color: $grey;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}
.response::-webkit-scrollbar-thumb:hover {
  background-color: $darkGrey;
}
.to-be-confirmed-body-section {
  display: grid;
  grid-template-columns: 0.35fr 0.65fr;
  column-gap: 2.2rem;
  padding: 3rem;
  .inbox {
    width: 100%;
    height: 100%;
    border-radius: 2.2rem;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    position: relative;
    .filter {
      display: flex;
      column-gap: 0.5rem;
      .filter-list {
        min-width: 4rem;
        min-height: 4rem;
        background-color: $primaryViolet;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: 0.3s all ease-in-out;
        .alert {
          transform: translateX(0.4rem) translateY(-0.4rem);
          top: 0%;
          right: 0%;
          min-width: 1rem;
          min-height: 1rem;
          position: absolute;
          border-radius: 50%;
          background-color: $yellow;
          outline: 0.2rem solid $white;
        }
        .icon {
          font-size: 1.4rem;
          color: $white;
        }
        &:hover {
          background-color: $darkViolet;
        }
      }
    }
    .dropdown__content {
      box-shadow: 0px 0px 5px $fadedViolet;
      z-index: -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 3rem;
      position: absolute;
      right: 0%;
      opacity: 0;
      width: 100%;
      background-color: $white;
      padding: 2.8rem;
      transition: 0.3s all ease-in-out;
      border-radius: 1.5rem;
      cursor: auto;
      &.is-show {
        transform: translateY(2rem);
        opacity: 1;
        z-index: 1;
        cursor: pointer;
      }
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
    }
    .search-filter {
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
          background-color: $white;
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
    .filter-show {
      display: flex;
      justify-content: space-between;
      color: $highlightViolet;
      margin: 0.4rem 0;
    }
    .inbox-list {
      height: 62.5rem;
      width: 100%;
      background-color: $white;
      border-radius: 2.2rem;
      overflow: scroll;
      .not-found {
        padding: 1.8rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80%;
        text-align: center;
        color: $darkGrey;
      }
    }
  }
  .inbox-detail {
    width: 100%;
    height: fit-content;
    background-color: $white;
    border-radius: 2.5rem;
    padding: 5rem 4.4rem;
    flex-direction: column;
    display: flex;
    .not-found {
      padding: 1.8rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80%;
      text-align: center;
      color: $darkGrey;
    }
    .loading {
      animation-name: floating;
      -webkit-animation-name: floating;
      animation-duration: 3s;
      -webkit-animation-duration: 3s;
      animation-iteration-count: infinite;
      -webkit-animation-iteration-count: infinite;
    }
    .inbox-detail-content {
      overflow: scroll;
      .due-date {
        margin-top: 2rem;
        color: $primaryViolet;
        span {
          color: $error;
        }
      }
      .sent-from {
        color: $darkGrey;
        span {
          text-decoration: underline;
        }
      }
      .button {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
