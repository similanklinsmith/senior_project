<template>
  <div class="inbox-body-section">
    <div class="inbox">
      <div class="filter">
        <div class="search-filter">
          <div class="input-icon">
            <i class="icon fa-solid fa-magnifying-glass"></i>
            <input
              id="search-input-inbox"
              class="small-text"
              type="text"
              :placeholder="text['inbox']['placeholder']"
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
            :content="inbox.meeting_detail"
            :time="inbox.create_at"
            :selectedId="selectedId"
            @selectInbox="selectInbox"
          />
          <div v-if="filterByTitle.length == 0" class="remark-text not-found">
            {{ text["inbox"]["notFound"] }}
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
              {{ text["inbox"]["sent"] }}
              {{ formatDateTime(selectedInbox.create_at) }}
              {{ text["inbox"]["by"] }}
              <span>{{ selectedInbox.secretary.name }}</span> &lt;{{
                selectedInbox.secretary.email
              }}&gt;
            </div>
            <div class="line" />
            <div class="main-details">
              <div class="label-header">
                <div class="bold-small-text">{{ text["inbox"]["date"] }}:</div>
                <div class="bold-small-text">{{ text["inbox"]["start"] }}:</div>
                <div class="bold-small-text">
                  {{ text["inbox"]["location"] }}:
                </div>
                <div class="bold-small-text">
                  {{ text["inbox"]["organizer"] }}:
                </div>
                <div class="bold-small-text">
                  {{ text["inbox"]["attendee"] }}:
                </div>
              </div>
              <div class="detail">
                <div class="small-text">
                  {{ formatDate(selectedInbox.meeting_date, lang) }} ({{
                    formatDateShort(selectedInbox.meeting_date)
                  }})
                </div>
                <div class="small-text">
                  {{ formatDateTime(selectedInbox.meeting_start, true) }} -
                  {{ formatDateTime(selectedInbox.meeting_end, true) }}
                </div>
                <div class="small-text">{{ selectedInbox.location }}</div>
                <div class="small-text">{{ selectedInbox.secretary.name }}</div>
                <div class="small-text attendee-list">
                  <span
                    v-for="(attendee, index) in selectedInbox.attendees.slice(
                      0,
                      slice
                    )"
                    :key="attendee.id"
                  >
                    {{ formatTitle(attendee.executive.title_code) }}
                    {{ attendee.executive.first_name }}
                    {{ attendee.executive.last_name }}
                    <span v-if="index < selectedInbox.attendees.length - 1"
                      >,</span
                    >
                  </span>
                  <span
                    class="see-more"
                    v-if="selectedInbox.attendees.length > 3"
                    @click="showAllAttendee"
                    ><span v-if="!isShowMore"
                      >{{ text["inbox"]["showMore"] }}&#40;{{
                        selectedInbox.attendees.length - 3
                      }}&#41;</span
                    ><span v-else>{{ text["inbox"]["showLess"] }}</span></span
                  >
                </div>
              </div>
            </div>
            <div class="line" />
            <div class="meeting-detail small-text">
              {{ selectedInbox.meeting_detail }}
            </div>
            <div class="meeting-link">
              <div class="meeting-link-label">
                <div class="bold-small-text">
                  {{ text["inbox"]["meetingLink"] }}
                </div>
                <div @click="copyLink('meeting-link-value')">
                  <i class="icon fa-regular fa-copy"></i>
                </div>
              </div>
              <div class="meeting-link-detail">
                <div class="small-text">
                  <span id="meeting-link-value" v-if="selectedInbox.attached_link">{{
                    selectedInbox.attached_link
                  }}</span>
                  <span v-else class="grey">{{ text["inbox"]["noLink"] }}</span>
                </div>
              </div>
            </div>
            <div class="attachment-file">
              <div class="attachment-file-label bold-small-text">
                {{ text["inbox"]["attachedFile"] }}
              </div>
              <div
                class="attachment-download"
                v-if="selectedInbox.attached_file"
                @click="downloadFile(selectedInbox.attached_file)"
              >
                <div class="file-section">
                  <div class="first-section">
                    <div class="file-icon">
                      <i class="icon fa-solid fa-file"></i>
                    </div>
                    <div class="file-details">
                      <div class="file-name bold-smallest-text">
                        {{ selectedInbox.attached_file }}
                      </div>
                      <div class="file-size smallest-text">
                        <!-- {{ formatFileSize(selectedInbox.file.size) }} -->
                      </div>
                    </div>
                  </div>
                  <div class="file-download">
                    <i class="fa-solid fa-circle-down icon"></i>
                  </div>
                </div>
              </div>
              <div v-else class="grey">{{ text["inbox"]["noFile"] }}</div>
            </div>
          </div>
          <div
            v-else-if="isLoading == true && selectedInbox == null"
            class="remark-text not-found loading"
          >
            {{ text["inbox"]["loading"] }}
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
  formatDateTimeInbox,
} from "@/helpers/formatDateTime";
import { ref } from "vue";
import { formatBytes } from "@/helpers/formatFileSize";
export default {
  name: "InboxView",
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
      isLoading: false,
      text: null,
      lang: null,
      searchInput: "",
      withInDate: "",
      filterDate: "",
      isShowDropdown: false,
      slice: 3,
      isShowMore: false,
      toBeConfirmedList: [],
      selectedInbox: null,
      selectedId: null,
    };
  },
  computed: {
    ...mapGetters([
      "getterMyInboxes",
      "getterMyInboxDetail",
      "getterExecutiveTitles",
      "getterSuccess",
      "getterFailed",
    ]),
    getInboxesList() {
      return this.$store.getters.getterMyInboxes;
    },
    filterByTitle() {
      return this.getInboxesList.filter((inbox) => {
        if (this.filterDate) {
          return (
            inbox.title
              .toLowerCase()
              .includes(this.searchInput.toLowerCase()) &&
            new Date(inbox.create_at.split("T")[0]).toLocaleDateString() ==
              new Date(this.filterDate).toLocaleDateString()
          );
        } else {
          return inbox.title
            .toLowerCase()
            .includes(this.searchInput.toLowerCase());
        }
      });
    },
  },
  methods: {
    ...mapActions([
      "getMyInboxes",
      "getMyInboxDetail",
      "getExecutiveTitle",
      "downloadWithAxios",
    ]),
    toggleDropdown() {
      this.isShowDropdown = !this.isShowDropdown;
    },
    downloadFile(name) {
      this.$store.dispatch("downloadWithAxios", name);
    },
    formatFileSize(size) {
      return formatBytes(size);
    },
    formatDateTime(dateTime, isTime) {
      return formatDateTimeDetail(dateTime, isTime);
    },
    formatDate(date, lang) {
      return formatDateTimeHeader(date, lang);
    },
    formatDateShort(date) {
      return formatDateTimeInbox(date, false);
    },
    formatTitle(str) {
      return this.getterExecutiveTitles[str];
    },
    showAllAttendee(attendees) {
      this.isShowMore = !this.isShowMore;
      this.isShowMore ? (this.slice = attendees.length) : (this.slice = 3);
    },
    async selectInbox(id) {
      this.selectedId = id;
      this.selectedInbox = null;
      this.isShowMore = false;
      this.slice = 3;
      this.isLoading = true;
      try {
        this.selectedInbox = await this.$store.dispatch(
          "getMyInboxDetail",
          this.selectedId
        );
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    copyLink(value) {
      let copyText = document.getElementById(value).innerHTML;
      navigator.clipboard.writeText(copyText);
    },
    onFocus() {
      document.getElementById("search-input-inbox").placeholder =
        this.text["inbox"]["focusSearch"];
    },
    onBlur() {
      document.getElementById("search-input-inbox").placeholder =
        this.text["inbox"]["placeholder"];
    },
    handleFilterDate() {
      this.filterDate =
        this.withInDate ?? new Date(this.withInDate).toLocaleDateString();
      this.isShowDropdown = false;
      this.selectedInbox = null;
    },
  },
  created() {
    this.getMyInboxes();
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
.grey {color: $grey;}
.response {display: flex;flex-direction: column;row-gap: 1rem;height: 50rem;overflow: scroll;margin: 1rem 0;padding: 0 1rem;}
.response::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1rem;}
.response::-webkit-scrollbar-track {margin: 1rem;border-radius: 0.5rem;}
.response::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}
.response::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}
.inbox-body-section {display: grid;grid-template-columns: 0.35fr 0.65fr;column-gap: 2.2rem;padding: 3rem;.inbox {width: 100%;height: 100%;border-radius: 2.2rem;display: flex;flex-direction: column;row-gap: 1rem;.filter {display: flex;column-gap: 0.5rem;position: relative;.filter-list {min-width: 4rem;min-height: 4rem;background-color: $primaryViolet;border-radius: 1rem;display: flex;align-items: center;justify-content: center;cursor: pointer;transition: 0.3s all ease-in-out;.alert {transform: translateX(0.4rem) translateY(-0.4rem);top: 0%;right: 0%;min-width: 1rem;min-height: 1rem;position: absolute;border-radius: 50%;background-color: $yellow;outline: 0.2rem solid $white;}.icon {font-size: 1.4rem;color: $white;}&:hover {background-color: $darkViolet;}}}.dropdown__content {box-shadow: 0px 0px 5px $fadedViolet;z-index: -1;display: flex;flex-direction: column;align-items: center;margin-top: 3rem;position: absolute;right: 0%;opacity: 0;width: 100%;background-color: $white;padding: 2.8rem;transition: 0.3s all ease-in-out;border-radius: 1.5rem;cursor: auto;&.is-show {transform: translateY(2rem);opacity: 1;z-index: 1;cursor: pointer;}input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}}.search-filter {position: relative;width: 100%;display: flex;align-items: center;justify-items: center;.input-icon {width: 100%;display: flex;align-items: center;justify-items: center;input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $white;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}.icon {position: absolute;right: 0;font-size: 1.4rem;margin-right: 1rem;color: $darkGrey;}}}.filter-show {display: flex;justify-content: space-between;color: $highlightViolet;margin: 0.4rem 0;}.inbox-list {height: 62.5rem;width: 100%;background-color: $white;border-radius: 2.2rem;overflow: scroll;.not-found {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 80%;text-align: center;color: $darkGrey;}}}.inbox-detail {width: 100%;height: 100%;background-color: $white;border-radius: 2.5rem;padding: 5rem 4.4rem;display: flex;flex-direction: column;.not-found {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 80%;text-align: center;color: $darkGrey;}.loading {animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.inbox-detail-content {overflow-y: scroll;}.line {width: 100%;height: 0.1rem;background-color: $bgColor;margin: 2rem 0;}.main-details {display: grid;grid-template-columns: 0.2fr 0.8fr;.label-header,.detail {.attendee-list{line-height: 1.6;}display: flex;flex-direction: column;row-gap: 2rem;}.detail {color: $primaryViolet;.see-more {color: $primaryViolet;text-decoration: underline;font-weight: 600;cursor: pointer;transition: 0.2s all ease-in-out;&:hover {color: $darkViolet;}}}}.meeting-detail {text-indent: 1rem;line-height: 1.8;max-height: 25rem;overflow-y: scroll;}.meeting-detail::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1rem;}.meeting-detail::-webkit-scrollbar-track {margin: 1rem;border-radius: 0.5rem;}.meeting-detail::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}.meeting-detail::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}.meeting-link {display: flex;flex-direction: column;margin-top: 2rem;row-gap: 1rem;.meeting-link-label {display: flex;align-items: center;.icon {color: $darkGrey;font-size: 1.8rem;margin-left: 0.5rem;cursor: pointer;transition: 0.2s all ease-in-out;}.icon:hover {color: $highlightViolet;}}.meeting-link-detail {#meeting-link-value{word-wrap: break-word; line-height: 1.6;}max-width:45rem;color: $primaryViolet;cursor: pointer;}}.attachment-file {margin-top: 2rem;display: flex;flex-direction: column;row-gap: 1rem;.attachment-download {width: 27rem;height: 7rem;border-radius: 0.5rem;padding: 1.6rem 2rem;background-color: $primaryGrey;display: flex;row-gap: 1.5rem;align-items: center;cursor: pointer;transition: 0.3s all ease-in-out;&:hover {background-color: $fadedViolet;.file-download {color: $primaryViolet !important;}}.file-section {display: flex;justify-content: space-between;align-items: center;width: 100%;.first-section {display: flex;column-gap: 1rem;align-items: center;.file-icon {display: flex;justify-content: center;align-items: center;width: 4rem;height: 4rem;border-radius: 0.5rem;background-color: $white;font-size: 1.4rem;color: $primaryViolet;}.file-details {display: flex;flex-direction: column;.file-name {color: $darkViolet;}.file-size {color: $darkGrey;}}}.file-download {font-size: 1.4rem;color: $darkGrey;transition: 0.3s all ease-in-out;}}}}.sent-from {color: $darkGrey;span {text-decoration: underline;}}.button {display: flex;justify-content: flex-end;}}}
</style>