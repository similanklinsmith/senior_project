<template>
  <div class="sent-body-section">
    <div class="inbox">
      <div class="filter">
        <div class="search-filter">
          <div class="input-icon">
            <i class="icon fa-solid fa-magnifying-glass"></i>
            <input
              id="search-input-sent"
              class="small-text"
              type="text"
              :placeholder="text['sent']['placeholder']"
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
                <label for="due" class="bold-small-text">{{
                  text["sent"]["dateWithin"]
                }}</label>
                <litepie-datepicker
                  id="due"
                  as-single
                  :disable-date="dDate"
                  :formatter="formatter"
                  v-model="withInDate"
                  :style="{ fontSize: '12px !important', marginTop: '1rem' }"
                />
              </div>
            </li>
            <li>
              <BaseButton
                buttonType="common-button"
                :btnText="text['sent']['search']"
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
          <span v-if="filterDate"
            >{{ text["sent"]["within"] }}: {{ filterDate }}</span
          >
        </div>
        <div class="small-text">
          {{ text["sent"]["results"] }}: {{ filterByTitle.length }}
        </div>
      </div>
      <div class="inbox-list">
        <transition-group name="route">
          <InboxComp
            v-for="inbox in filterByTitle"
            :key="inbox.id"
            :id="inbox.id"
            :title="inbox.title"
            :time="inbox.create_at"
            :content="text['sent']['sentPoll']"
            :selectedId="selectedId"
            @selectInbox="selectInbox"
          />
          <div v-if="filterByTitle.length == 0" class="remark-text not-found">
            {{ text["sent"]["notFound"] }}
          </div>
        </transition-group>
      </div>
    </div>
    <transition name="route">
      <div v-if="selectedId != null">
        <div class="inbox-detail">
          <div
            class="inbox-detail-content"
            v-if="isLoading == false && selectedInbox != null"
          >
            <div class="title remark-text">{{ selectedInbox.title }}</div>
            <div class="sent-from smallest-text">
              {{ text["sent"]["sentByYou"] }}
              {{ formatDateTime(selectedInbox.create_at) }}
            </div>
            <div class="line"></div>
            <div class="content">
              <div class="attendees">
                <div class="bold-small-text">
                  {{ text["sent"]["attendees"] }}:
                </div>
                <div
                  class="small-text attendee-list"
                  v-for="(attendee, index) in selectedInbox.attendees.slice(
                    0,
                    slice
                  )"
                  :key="attendee"
                >
                  {{ formatAttendee(attendee)
                  }}<span v-if="index != selectedInbox.attendees.length - 1"
                    >,</span
                  >
                </div>
                <span
                  class="see-more bold-small-text"
                  v-if="selectedInbox.attendees.length > 2"
                  @click="showAllAttendee"
                  ><div v-if="!isShowMore">
                    {{ text["sent"]["showMore"] }} &#40;{{
                      selectedInbox.attendees.length - 2
                    }}&#41;
                  </div>
                  <div v-else>{{ text["sent"]["showLess"] }}</div></span
                >
              </div>
              <div class="time-slots">
                <div class="bold-small-text faded">
                  {{ text["sent"]["timeSlot"] }}
                </div>
                <div class="slot">
                  <div class="start">
                    <div class="bold-small-text">
                      {{ text["sent"]["startDate"] }}:
                    </div>
                    <div class="small-text">
                      {{ selectedInbox.start_date.split("T")[0] }}
                    </div>
                  </div>
                  <div class="end">
                    <div class="bold-small-text">
                      {{ text["sent"]["endDate"] }}:
                    </div>
                    <div class="small-text">
                      {{ selectedInbox.end_date.split("T")[0] }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="duration">
                <div class="bold-small-text">
                  {{ text["sent"]["duration"] }}:
                </div>
                <div class="small-text">
                  {{ selectedInbox.duration_of_time.toString().split(".")[0] }}
                  {{ text["sent"]["hour"] }}
                  <span
                    v-if="
                      selectedInbox.duration_of_time.toString().split('.')[1]
                    "
                    >{{
                      selectedInbox.duration_of_time.toString().split(".")[1] *
                      6
                    }}
                    {{ text["sent"]["minute"] }}</span
                  >
                </div>
              </div>
              <div class="due-date">
                <div class="bold-small-text">
                  {{ text["sent"]["dueDate"] }}:
                </div>
                <div class="small-text">
                  {{ selectedInbox.due_date_time.split("T")[0] }}
                  <div class="remaining-day">
                    &#40;{{
                      calculateRemainingDay(selectedInbox.due_date_time)
                    }}
                    {{ text["sent"]["dayRemain"] }}&#41;
                  </div>
                </div>
              </div>
            </div>
            <div
              class="button"
              v-if="new Date(selectedInbox.due_date_time) >= new Date()"
            >
              <BaseButton
                buttonType="common-button"
                :btnText="text['sent']['deletePoll']"
                textColor="white"
                textHover="white"
                color="#F33C3C"
                hoverColor="#d93333"
                width="fit-content"
                @click="isShowPopup = true"
              >
              </BaseButton>
            </div>
          </div>
          <div
            v-else-if="isLoading == true && selectedInbox == null"
            class="remark-text not-found loading"
          >
            {{ text["sent"]["loading"] }}
          </div>
          <div
            v-else-if="isLoading == false && selectedInbox == null"
            class="remark-text not-found"
          >
            {{ text["notFound"]["errorGetData"] }}
          </div>
        </div>
      </div>
    </transition>
    <BasePopup
      v-if="isShowPopup"
      @closeModal="isShowPopup = false"
      :image="require(`@/assets/decorations/delete_executive.png`)"
    >
      <template v-slot:popupContent>
        {{ text["sent"]["prePopupText"] }}(<span
          :style="{ color: '#C4C4C4 !important' }"
          >{{ selectedInbox.title }}</span
        >) {{ text["sent"]["postPopupText"] }}
      </template>
      <template v-slot:buttons>
        <BaseButton
          buttonType="common-button"
          :btnText="text['sent']['confirmDelete']"
          textColor="white"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="deletePollAppointment(selectedId)"
        >
        </BaseButton>
        <BaseButton
          buttonType="outlined-button"
          :btnText="text['sent']['cancel']"
          textColor="#F33C3C"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="isShowPopup = false"
        >
        </BaseButton>
      </template>
    </BasePopup>
    <BaseAlert v-if="getterSuccess" :status="`success`">
      {{ text["sent"]["success"] }}
    </BaseAlert>
    <BaseAlert v-if="getterFailed" :status="`failed`">
      {{ text["sent"]["failed"] }}
    </BaseAlert>
  </div>
</template>

<script>
import { formatDateTimeDetail } from "@/helpers/formatDateTime";
import LitepieDatepicker from "litepie-datepicker";
import InboxComp from "@/components/meeting/InboxComp.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import BasePopup from "@/components/UI/BasePopup.vue";
import BaseAlert from "@/components/UI/BaseAlert.vue";
import { mapGetters, mapActions } from "vuex";
import { ref } from "vue";

export default {
  name: "InboxView",
  components: {
    InboxComp,
    BaseButton,
    BasePopup,
    LitepieDatepicker,
    BaseAlert,
  },
  setup() {
    const dDate = (date) => {
      return date > new Date();
    };
    const formatter = ref({
      date: "YYYY-MM-DD",
      month: "MMM",
    });
    return {
      formatter,
      dDate,
    };
  },
  data() {
    return {
      text: null,
      lang: null,
      searchInput: "",
      selectedInbox: null,
      selectedId: null,
      slice: 2,
      isShowMore: false,
      isShowPopup: false,
      isShowDropdown: false,
      withInDate: "",
      filterDate: "",
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters([
      "getterMyPolls",
      "getterMyPollDetail",
      "getterExecutiveTitles",
      "getterSuccess",
      "getterFailed",
    ]),
    getPollsList() {
      return this.$store.getters.getterMyPolls;
    },
    filterByTitle() {
      return this.getPollsList.filter((toBeConfirmed) => {
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
  },
  methods: {
    ...mapActions(["getMyPolls", "getMyPollDetail", "getExecutiveTitle"]),
    onFocus() {
      document.getElementById("search-input-sent").placeholder =
        this.text["sent"]["focusSearch"];
    },
    onBlur() {
      document.getElementById("search-input-sent").placeholder =
        this.text["sent"]["placeholder"];
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
    async selectInbox(id) {
      this.selectedInbox = null;
      this.isShowMore = false;
      this.slice = 2;
      this.selectedId = id;
      this.isLoading = true;
      try {
        this.selectedInbox = await this.$store.dispatch(
          "getMyPollDetail",
          this.selectedId
        );
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
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
    formatDateTime(dateTime) {
      return formatDateTimeDetail(dateTime);
    },
    formatTitle(str) {
      return this.getterExecutiveTitles[str];
    },
    formatAttendee(attendee) {
      return `${this.formatTitle(attendee.executive.title_code)} ${
        attendee.executive.first_name
      } ${attendee.executive.last_name}`;
    },
    showAllAttendee(attendees) {
      this.isShowMore = !this.isShowMore;
      this.isShowMore ? (this.slice = attendees.length) : (this.slice = 2);
    },
    async deletePollAppointment(id) {
      await this.$store.dispatch("deletePollAppointment", id);
      this.isShowPopup = false;
      this.selectedInbox = null;
      this.selectedId = null;
    },
  },
  created() {
    this.getMyPolls();
    this.getExecutiveTitle();
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
ul {width: 100%;list-style: none;display: flex;flex-direction: column;row-gap: 1rem;li {color: $darkViolet;transition: 0.3s all ease-in-out;}}
.response {display: flex;flex-direction: column;row-gap: 1rem;height: 50rem;overflow: scroll;margin: 1rem 0;padding: 0 1rem;}.response::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1rem;}.response::-webkit-scrollbar-track {margin: 1rem;border-radius: 0.5rem;}.response::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}.response::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}.sent-body-section {display: grid;grid-template-columns: 0.35fr 0.65fr;column-gap: 2.2rem;padding: 3rem;.not-found {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 80%;text-align: center;color: $darkGrey;}.loading {animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.inbox {width: 100%;height: 100%;border-radius: 2.2rem;display: flex;flex-direction: column;row-gap: 1rem;position: relative;.filter {display: flex;column-gap: 0.5rem;.filter-list {min-width: 4rem;min-height: 4rem;background-color: $primaryViolet;border-radius: 1rem;display: flex;align-items: center;justify-content: center;cursor: pointer;transition: 0.3s all ease-in-out;.alert {transform: translateX(0.4rem) translateY(-0.4rem);top: 0%;right: 0%;min-width: 1rem;min-height: 1rem;position: absolute;border-radius: 50%;background-color: $yellow;outline: 0.2rem solid $white;}.icon {font-size: 1.4rem;color: $white;}&:hover {background-color: $darkViolet;}}}.dropdown__content {box-shadow: 0px 0px 5px $fadedViolet;z-index: -1;display: flex;flex-direction: column;align-items: center;margin-top: 3rem;position: absolute;right: 0%;opacity: 0;width: 100%;background-color: $white;padding: 2.8rem;transition: 0.3s all ease-in-out;border-radius: 1.5rem;cursor: auto;&.is-show {transform: translateY(2rem);opacity: 1;z-index: 1;cursor: pointer;}input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}}.search-filter {position: relative;width: 100%;display: flex;align-items: center;justify-items: center;.input-icon {width: 100%;display: flex;align-items: center;justify-items: center;input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $white;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}.icon {position: absolute;right: 0;font-size: 1.4rem;margin-right: 1rem;color: $darkGrey;}}}.filter-show {display: flex;justify-content: space-between;color: $highlightViolet;margin: 0.4rem 0;}.inbox-list {height: 62.5rem;width: 100%;background-color: $white;border-radius: 2.2rem;overflow: scroll;.not-found {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 80%;text-align: center;color: $darkGrey;}}}.inbox-detail {width: 100%;height: 100%;background-color: $white;border-radius: 2.5rem;padding: 5rem 4.4rem;flex-direction: column;display: flex;.inbox-detail-content {overflow: scroll;.due-date {margin-top: 2rem;color: $primaryViolet;span {color: $error;}}.sent-from {color: $darkGrey;span {text-decoration: underline;}}.button {display: flex;justify-content: flex-end;}}.line {margin-top: 2.4rem;width: 100%;height: 0.1rem;background-color: $grey;}.sent-from {color: $darkGrey;}.content {margin-top: 3rem;margin-bottom: 3rem;display: flex;row-gap: 4rem;flex-direction: column;.attendees {display: flex;column-gap: 0.5rem;width: 100%;flex-wrap: wrap;row-gap: 0.8rem;.attendee-list {color: $primaryViolet;}.see-more {color: $primaryViolet;text-decoration: underline;cursor: pointer;transition: 0.2s all ease-in-out;&:hover {color: $darkViolet;}}}.time-slots {display: flex;flex-direction: column;row-gap: 2rem;.faded {color: $darkGrey;}.slot {display: flex;column-gap: 8rem;.start,.end {display: flex;column-gap: 0.5rem;.small-text {color: $primaryViolet;}}}}.duration,.due-date {display: flex;column-gap: 0.5rem;.small-text {color: $primaryViolet;display: flex;column-gap: 0.5rem;.remaining-day {color: $error;}}}}.button {display: flex;justify-content: flex-end;}}}
</style>