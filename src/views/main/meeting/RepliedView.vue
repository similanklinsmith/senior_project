<template>
  <div class="replied-body-section">
    <div class="inbox">
      <div class="filter">
        <div class="search-filter">
          <div class="input-icon">
            <i class="icon fa-solid fa-magnifying-glass"></i>
            <input
              id="search-input-replied"
              class="small-text"
              type="text"
              :placeholder="text['replied']['placeholder']"
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
                  text["replied"]["dateWithin"]
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
                :btnText="text['replied']['search']"
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
            >{{ text["replied"]["within"] }}: {{ filterDate }}</span
          >
        </div>
        <div class="small-text">
          {{ text["replied"]["results"] }}: {{ filterByTitle.length }}
        </div>
      </div>
      <div class="inbox-list">
        <transition-group name="route">
          <InboxComp
            v-for="inbox in filterByTitle"
            :key="inbox.id"
            :id="inbox.id"
            :title="inbox.title"
            :content="text['replied']['sentPoll'] + inbox.title"
            :time="inbox.create_at"
            :selectedId="selectedId"
            @selectInbox="selectInbox"
          />
          <div v-if="filterByTitle.length == 0" class="remark-text not-found">
            {{ text["replied"]["notFound"] }}
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
              {{ text["replied"]["sentOn"] }}
              {{ formatDateTime(inboxDetail.create_at) }}
              {{ text["replied"]["by"] }}
              <span>{{ inboxDetail.secretary.name }}</span>
              &lt;{{ inboxDetail.secretary.email }}&gt;
            </div>
            <div class="line" />
            <div class="response">
              <div
                class="response-container"
                v-for="(executive, index) in inboxDetail.executives"
                :key="index"
              >
                <div>
                  <div class="name bold-content-text">
                    {{ executive.first_name }} {{ executive.last_name }}
                    <span>({{ text["replied"]["required"] }})</span>
                  </div>
                  <div class="bold-smallest-text label-text">
                    {{ text["replied"]["preferTimeslot"] }}
                  </div>
                </div>
                <div
                  v-for="(response, index) in executive.responses"
                  :key="index"
                  class="days"
                >
                  <div
                    class="bold-small-text"
                    :style="
                      response.is_accept == '1'
                        ? { color: '#39CF5A' }
                        : { color: '#F33C3C' }
                    "
                  >
                    {{ formatDateTimeHeader(response.date, lang) }}
                    <span v-if="response.is_accept == '0'"
                      >({{ text["replied"]["declined"] }})</span
                    >
                  </div>
                  <div class="slots" v-if="response.is_accept != '0'">
                    <div
                      class="show-time-slot"
                      v-for="time in response.periodOfTime"
                      :key="time"
                    >
                      <div class="bold-smallest-text">
                        {{ text["replied"]["from"] }}
                        {{ time.from.split(":")[0] }}:{{
                          time.from.split(":")[1]
                        }}, {{ text["replied"]["end"] }}
                        {{ time.to.split(":")[0] }}:{{ time.to.split(":")[1] }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else-if="isLoading == true && inboxDetail == null"
            class="remark-text not-found loading"
          >
            {{ text["replied"]["loading"] }}
          </div>
          <div
            v-else-if="isLoading == false && inboxDetail == null"
            class="remark-text not-found"
          >
            {{ text["notFound"]["errorGetData"] }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import InboxComp from "@/components/meeting/InboxComp.vue";
import { mapGetters, mapActions } from "vuex";
import LitepieDatepicker from "litepie-datepicker";
import BaseButton from "@/components/UI/BaseButton.vue";
import {
  formatDateTimeDetail,
  formatDateTimeHeader,
} from "@/helpers/formatDateTime";
import { ref } from "vue";
export default {
  name: "BeConfirmedView",
  components: { InboxComp, LitepieDatepicker, BaseButton },
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
      isShowDropdown: false,
      withInDate: "",
      filterDate: "",
      repliedList: [],
      selectedInbox: null,
      inboxDetail: null,
      selectedId: null,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(["getterMyReplies", "getterMyReplyDetail"]),
    getReplyList() {
      return this.$store.getters.getterMyReplies;
    },
    filterByTitle() {
      return this.getReplyList.filter((reply) => {
        if (this.filterDate) {
          return (
            reply.title
              .toLowerCase()
              .includes(this.searchInput.toLowerCase()) &&
            new Date(reply.create_at.split("T")[0]).toLocaleDateString() ==
              new Date(this.filterDate).toLocaleDateString()
          );
        } else {
          return reply.title
            .toLowerCase()
            .includes(this.searchInput.toLowerCase());
        }
      });
    },
  },
  methods: {
    ...mapActions(["getMyReplies", "getMyReplyDetail"]),
    toggleDropdown() {
      this.isShowDropdown = !this.isShowDropdown;
    },
    onFocus() {
      document.getElementById("search-input-replied").placeholder =
        this.text["replied"]["focusSearch"];
    },
    onBlur() {
      document.getElementById("search-input-replied").placeholder =
        this.text["replied"]["placeholder"];
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
    formatDateTime(dateTime) {
      return formatDateTimeDetail(dateTime);
    },
    formatDateTimeHeader(dateTime, lang) {
      return formatDateTimeHeader(dateTime, lang);
    },
    async selectInbox(id) {
      this.selectedId = id;
      this.isLoading = true;
      try {
        this.inboxDetail = await this.$store.dispatch(
          "getMyReplyDetail",
          this.selectedId
        );
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.getMyReplies();
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
.response {height: 50rem;overflow: scroll;margin: 1.5rem 0;padding: 0 1rem;.response-container {display: flex;flex-direction: column;row-gap: 2.2rem;margin-bottom: 3rem;.name {span {color: $primaryViolet;font-weight: 400;}}.label-text {margin-top: 1rem;color: $darkGrey;}.days {display: flex;flex-direction: column;row-gap: 2rem;}.slots {display: flex;flex-direction: column;row-gap: 0.25rem;.show-time-slot {width: fit-content;border: 1px solid $darkViolet;padding: 1.8rem 2.2rem;border-radius: 0.5rem;margin: 0.25rem 0;.bold-smallest-text {color: $darkViolet !important;}}}}}
.response::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1rem;}
.response::-webkit-scrollbar-track {margin: 1rem;border-radius: 0.5rem;}
.response::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}
.response::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}
.replied-body-section {display: grid;grid-template-columns: 0.35fr 0.65fr;column-gap: 2.2rem;padding: 3rem;.inbox {width: 100%;height: 100%;border-radius: 2.2rem;display: flex;flex-direction: column;row-gap: 1rem;position: relative;.filter {display: flex;column-gap: 0.5rem;.filter-list {min-width: 4rem;min-height: 4rem;background-color: $primaryViolet;border-radius: 1rem;display: flex;align-items: center;justify-content: center;cursor: pointer;transition: 0.3s all ease-in-out;.alert {transform: translateX(0.4rem) translateY(-0.4rem);top: 0%;right: 0%;min-width: 1rem;min-height: 1rem;position: absolute;border-radius: 50%;background-color: $yellow;outline: 0.2rem solid $white;}.icon {font-size: 1.4rem;color: $white;}&:hover {background-color: $darkViolet;}}}.dropdown__content {box-shadow: 0px 0px 5px $fadedViolet;z-index: -1;display: flex;flex-direction: column;align-items: center;margin-top: 3rem;position: absolute;right: 0%;opacity: 0;width: 100%;background-color: $white;padding: 2.8rem;transition: 0.3s all ease-in-out;border-radius: 1.5rem;cursor: auto;&.is-show {transform: translateY(2rem);opacity: 1;z-index: 1;cursor: pointer;}input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}}.search-filter {position: relative;width: 100%;display: flex;align-items: center;justify-items: center;.input-icon {width: 100%;display: flex;align-items: center;justify-items: center;input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $white;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}.icon {position: absolute;right: 0;font-size: 1.4rem;margin-right: 1rem;color: $darkGrey;}}}.filter-show {display: flex;justify-content: space-between;color: $highlightViolet;margin: 0.4rem 0;}.inbox-list {height: 62.5rem;width: 100%;background-color: $white;border-radius: 2.2rem;overflow: scroll;.not-found {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 80%;text-align: center;color: $darkGrey;}}}.inbox-detail {width: 100%;height: 100%;background-color: $white;border-radius: 2.5rem;padding: 5rem 4.4rem;flex-direction: column;display: flex;.not-found {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 80%;text-align: center;color: $darkGrey;}.loading {animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.line {width: 100%;height: 0.1rem;background-color: $bgColor;margin: 2rem 0;}.inbox-detail-content {overflow: scroll;.sent-from {color: $darkGrey;span {text-decoration: underline;}}.button {display: flex;justify-content: flex-end;}}}}
</style>