<template>
  <div class="to-be-confirmed-body-section">
    <div class="inbox">
      <div class="filter">
        <div class="search-filter">
          <div class="input-icon">
            <i class="icon fa-solid fa-magnifying-glass"></i>
            <input
              class="small-text"
              type="text"
              :placeholder="text['confirmed']['placeholder']"
              v-model="searchInput"
              id="search-input-confirmed"
              @blur="onBlur"
              @focus="onFocus"
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
                  text["confirmed"]["dateWithin"]
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
                :btnText="text['confirmed']['search']"
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
            >{{ text["confirmed"]["within"] }}: {{ filterDate }}</span
          >
        </div>
        <div class="small-text">
          {{ text["confirmed"]["results"] }}: {{ filterByTitle.length }}
        </div>
      </div>
      <div class="inbox-list">
        <transition-group name="route">
          <InboxComp
            v-for="inbox in filterByTitle"
            :key="inbox.id"
            :id="inbox.id"
            :title="inbox.title"
            :content="text['confirmed']['sentPoll']"
            :time="inbox.create_at"
            :selectedId="selectedId"
            @selectInbox="selectInbox"
          />
          <div v-if="filterByTitle.length == 0" class="remark-text not-found">
            {{ text["confirmed"]["notFound"] }}
          </div>
        </transition-group>
      </div>
    </div>
    <transition name="route">
      <div class="inbox-detail" v-if="selectedId != null">
        <div
          class="inbox-detail-content"
          v-if="isLoading == false && selectedInbox != null"
        >
          <div class="title remark-text">{{ selectedInbox.title }}</div>
          <div class="sent-from smallest-text">
            {{ text["confirmed"]["preCreate"] }}
            {{ formatDateTime(selectedInbox.create_at) }}
            {{ text["confirmed"]["by"] }}
          </div>
          <div class="line" />
          <div class="bold-small-text due-date">
            <span>*</span>{{ text["confirmed"]["expired"] }}
            {{ selectedInbox.slots[0].date.split("T")[0] }}
            <span v-if="new Date(selectedInbox.slots[0].date) >= new Date()"
              >({{ expiredCount }} {{ text["confirmed"]["postDueDate"] }})</span
            >
            <span v-else>({{ text["confirmed"]["alreadyExpired"] }})</span>
          </div>
          <div
            class="result"
            :class="`${
              new Date(selectedInbox.slots[0].date) < new Date()
                ? 'expired'
                : ''
            }`"
          >
            <div v-for="(slot, index) in selectedInbox.slots" :key="index">
              <div class="row-header">
                <div class="bold-content-text">
                  {{ formatDateTimeHeader(slot.date, lang) }}
                </div>
                <div
                  :style="
                    'accepted' in slot.responses[0] && slot.responses[0].accepted.length >= 2
                      ? {}
                      : { 'pointer-events': 'none', filter: 'grayscale(1)' }
                  "
                >
                  <BaseButton
                    buttonType="common-button"
                    :btnText="text['confirmed']['showSchedule']"
                    textColor="white"
                    textHover="white"
                    color="#7452FF"
                    hoverColor="#23106D"
                    width="fit-content"
                    @click="
                      'accepted' in slot.responses[0]
                        ? onClickShowSchedule(slot.date, index)
                        : null
                    "
                  >
                  </BaseButton>
                </div>
              </div>
              <div v-for="res in slot.responses" :key="res.id">
                <ResultComp :response="res" />
              </div>
            </div>
          </div>
          <teleport to="#portal-target" v-if="isShowSchedule">
            <div class="modal" @click="onClickCloseSchedule"></div>
            <div class="container-cust">
              <div class="first-col">
                <div class="suggested-time">
                  <div class="bold-content-text">
                    {{ text["confirmed"]["suggestedTime"] }}
                  </div>
                  <div class="time-slot">
                    <div
                      class="slot"
                      v-for="(slot, index) in bestTimeSlot"
                      :key="slot"
                      :style="
                        index == 0
                          ? { 'background-color': '#FFCB57 !important' }
                          : {}
                      "
                    >
                      <div class="bold-smallest-text">
                        {{ slot.id }} ({{ slot.eventCount }})
                      </div>
                    </div>
                  </div>
                </div>
                <div class="calendar">
                  <vue-cal
                    class="vuecal--violet-theme vuecal--disabled-button"
                    :selected-date="form.date"
                    :time-from="0 * 60"
                    :time-step="30"
                    active-view="day"
                    :events="acceptedArray"
                    :split-days="splitDays"
                    :sticky-split-labels="stickySplitLabels"
                    hide-view-selector
                  >
                  </vue-cal>
                </div>
              </div>
              <div class="second-col">
                <div class="form">
                  <div class="duration-container">
                    <div class="bold-content-text">
                      {{ text["confirmed"]["createMeeting"] }}
                    </div>
                    <div class="duration bold-small-text">
                      {{ text["confirmed"]["duration"] }}
                      {{
                        selectedInbox.duration_of_time.toString().split(".")[0]
                      }}{{ text["confirmed"]["hour"] }}
                      <span
                        v-if="
                          selectedInbox.duration_of_time
                            .toString()
                            .split('.')[1]
                        "
                        >{{
                          parseInt(
                            selectedInbox.duration_of_time
                              .toString()
                              .split(".")[1]
                          ) * 6
                        }}{{ text["confirmed"]["minute"] }}</span
                      >
                    </div>
                  </div>
                  <form @submit.prevent="handleCreateMeeting">
                    <div class="input-form" id="top">
                      <label for="title" class="bold-small-text"
                        >{{ text["confirmed"]["title"]
                        }}<span class="required">*</span></label
                      >
                      <input
                        class="small-text"
                        type="text"
                        :placeholder="text['confirmed']['title']"
                        id="title"
                        name="title"
                        v-model.trim="form.title"
                        maxlength="200"
                      />
                      <div class="required bold-small-text">
                        {{ errors.title }}
                      </div>
                    </div>
                    <div class="input-form">
                      <label for="description" class="bold-small-text"
                        >{{ text["confirmed"]["description"]
                        }}<span class="required">*</span></label
                      >
                      <textarea
                        class="small-text"
                        type="text"
                        :placeholder="text['confirmed']['description']"
                        id="description"
                        name="description"
                        v-model="form.description"
                      />
                      <div class="required bold-small-text">
                        {{ errors.description }}
                      </div>
                    </div>
                    <div class="row-input">
                      <div class="input-form">
                        <label for="date" class="bold-small-text">{{
                          text["confirmed"]["date"]
                        }}</label>
                        <input
                          class="small-text readonly"
                          type="date"
                          placeholder="date"
                          id="date"
                          name="date"
                          :value="form.date"
                          readonly
                        />
                      </div>
                      <div class="input-form">
                        <label for="from" class="bold-small-text"
                          >{{ text["confirmed"]["from"]
                          }}<span class="required">*</span></label
                        >
                        <input
                          class="small-text"
                          type="time"
                          placeholder="HH:MM"
                          id="from"
                          name="from"
                          v-model="form.from"
                          @change="triggerFillToTime"
                        />
                        <div class="required bold-small-text">
                          {{ errors.from }}
                        </div>
                      </div>
                      <div class="input-form">
                        <label for="to" class="bold-small-text">{{
                          text["confirmed"]["to"]
                        }}</label>
                        <input
                          class="small-text readonly"
                          type="time"
                          placeholder="HH:MM"
                          id="to"
                          name="to"
                          v-model="form.to"
                          readonly
                        />
                      </div>
                    </div>
                    <div class="input-form">
                      <label for="location" class="bold-small-text"
                        >{{ text["confirmed"]["location"]
                        }}<span class="required">*</span></label
                      >
                      <select
                        name="location"
                        id="location"
                        v-model="form.location"
                      >
                        <option value="">{{ text["input"]["none"] }}</option>
                        <option value="Microsoft Team">Microsoft Teams</option>
                        <option value="Zoom">Zoom</option>
                        <option value="WebEx">WebEx</option>
                        <option value="Google Meet">Google Meet</option>
                        <option value="Others">Others</option>
                      </select>
                      <div class="required bold-small-text">
                        {{ errors.location }}
                      </div>
                    </div>
                    <div class="input-form" v-if="form.location == 'Others'">
                      <label for="other" class="bold-small-text"
                        >{{ text["confirmed"]["otherLocation"]
                        }}<span class="required">*</span></label
                      >
                      <input
                        class="small-text"
                        type="text"
                        :placeholder="
                          text['confirmed']['otherLocationPlaceholder']
                        "
                        id="other"
                        name="other"
                        v-model="form.other"
                        maxlength="200"
                      />
                      <div class="required bold-small-text">
                        {{ errors.other }}
                      </div>
                    </div>
                    <div class="input-form" v-if="form.location != ''">
                      <label for="link" class="bold-small-text"
                        >{{ text["confirmed"]["meetingLink"]
                        }}<span
                          v-if="form.location != 'Others'"
                          class="required"
                          >*</span
                        ><span v-else class="optional-field"
                          >({{ text["confirmed"]["optional"] }})</span
                        >
                      </label>
                      <input
                        class="small-text"
                        type="text"
                        placeholder="www.example-link.com"
                        id="link"
                        name="link"
                        v-model="form.meetingLink"
                        maxlength="200"
                      />
                      <div class="required bold-small-text">
                        {{ errors.meetingLink }}
                      </div>
                    </div>
                    <div class="bold-small-text optional">
                      {{ text["confirmed"]["optional"] }}
                    </div>
                    <div class="input-form" v-if="!dropzoneFile">
                      <BaseDropZone
                        @drop.prevent="drop"
                        @change="selectedFile"
                      />
                    </div>
                    <div class="attachment-download" v-if="dropzoneFile">
                      <div class="file-section">
                        <div class="first-section">
                          <div class="file-icon">
                            <i class="icon fa-solid fa-file"></i>
                          </div>
                          <div class="file-details">
                            <div class="file-name bold-small-text">
                              {{
                                dropzoneFile.name.length >= 10
                                  ? dropzoneFile.name.substring(0, 10) +
                                    ".." +
                                    dropzoneFile.name.substring(
                                      dropzoneFile.name.indexOf("."),
                                      dropzoneFile.name.length
                                    )
                                  : dropzoneFile.name
                              }}
                            </div>
                            <div class="file-size smallest-text">
                              {{ formatFileSize(dropzoneFile.size) }}
                            </div>
                          </div>
                        </div>
                        <div class="file-delete" @click="removeFile">
                          <i class="icon fa-solid fa-trash"></i>
                        </div>
                      </div>
                    </div>
                    <div class="required bold-small-text">
                      {{ errors.fileSize }}
                    </div>
                    <div class="button">
                      <BaseButton
                        buttonType="outlined-button"
                        :btnText="text['confirmed']['cancel']"
                        textColor="#F33C3C"
                        textHover="white"
                        color="#F33C3C"
                        hoverColor="#F33C3C"
                        @onClick="onClickCloseSchedule"
                      />
                      <BaseButton
                        buttonType="common-button"
                        :btnText="text['confirmed']['createMeeting']"
                        textColor="white"
                        textHover="white"
                        color="#7452FF"
                        hoverColor="#23106D"
                        width="fit-content"
                        type="submit"
                      >
                      </BaseButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </teleport>
        </div>
        <div
          v-else-if="isLoading == true && selectedInbox == null"
          class="remark-text not-found loading"
        >
          {{ text["confirmed"]["loading"] }}
        </div>
        <div
          v-else-if="isLoading == false && selectedInbox == null"
          class="remark-text not-found"
        >
          {{ text["notFound"]["errorGetData"] }}
        </div>
      </div>
    </transition>
    <BaseAlert v-if="getterSuccess" :status="`success`">
      {{ text["confirmed"]["succces"] }}
    </BaseAlert>
    <BaseAlert v-if="getterFailed" :status="`failed`">
      {{ text["confirmed"]["failed"] }}
    </BaseAlert>
    <teleport to="#portal-target">
      <div class="modal-loading" v-if="isLoadingSend">
        <div class="pop-up-loading flex-col-center">
          <div class="flex-col-center">
            <div class="logo header-text">
              <span class="primary-violet">M</span>OMENT<span class="yellow"
                >O</span
              ><span class="faded-violet">.</span>
            </div>
            <div class="image">
              <img
                src="@/assets/decorations/sending.png"
                alt="sending illustrations"
              />
            </div>
            <div class="remark-text" style="color: white">
              {{ text["confirmed"]["sending"] }}
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import InboxComp from "@/components/meeting/InboxComp.vue";
import ResultComp from "@/components/meeting/ResultComp.vue";
import BaseDropZone from "@/components/UI/BaseDropZone.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseAlert from "@/components/UI/BaseAlert.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { ref } from "vue";
import {
  formatDateTimeDetail,
  formatDateTimeHeader,
} from "@/helpers/formatDateTime";
import { formatBytes } from "@/helpers/formatFileSize";
import { mapGetters, mapActions } from "vuex";
import LitepieDatepicker from "litepie-datepicker";
export default {
  name: "ConfirmedView",
  components: {
    InboxComp,
    ResultComp,
    BaseDropZone,
    BaseButton,
    BaseAlert,
    VueCal,
    LitepieDatepicker,
  },
  setup() {
    let dropzoneFile = ref(null);
    const drop = (e) => {
      dropzoneFile.value = e.dataTransfer.files[0];
    };
    const selectedFile = () => {
      dropzoneFile.value = document.querySelector(".dropzoneFile").files[0];
    };
    const removeFile = () => {
      dropzoneFile.value = null;
    };
    const dDate = (date) => {
      return date > new Date();
    };
    const formatter = ref({
      date: "YYYY-MM-DD",
      month: "MMM",
    });
    return { dropzoneFile, drop, selectedFile, removeFile, formatter, dDate };
  },
  data() {
    return {
      text: null,
      lang: null,
      isShowDropdown: false,
      withInDate: "",
      filterDate: "",
      isLoading: false,
      isLoadingSend: false,
      acceptedArray: [],
      searchInput: "",
      toBeConfirmedList: [],
      selectedInbox: null,
      selectedId: null,
      response: null,
      isShowSchedule: false,
      stickySplitLabels: false,
      bestTimeSlot: [],
      splitDays: [],
      expiredCount: null,
      form: {
        title: null,
        description: null,
        date: null,
        from: null,
        to: null,
        location: "",
        other: null,
        meetingLink: null,
      },
      errors: {},
      regex: new RegExp(
        "^(https?:\\/\\/)?" +
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
          "((\\d{1,3}\\.){3}\\d{1,3}))" +
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
          "(\\?[;&a-z\\d%_.~+=-]*)?" +
          "(\\#[-a-z\\d_]*)?$",
        "i"
      ),
    };
  },
  computed: {
    ...mapGetters(["getterMyPolls", "getterSuccess", "getterFailed"]),
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
    titleIsValid() {
      return !!this.form.title;
    },
    descriptionIsValid() {
      return !!this.form.description;
    },
    fromIsValid() {
      return !!this.form.from;
    },
    locationIsValid() {
      return !!this.form.location;
    },
    meetingLinkIsValid() {
      return !!this.form.meetingLink;
    },
    otherIsValid() {
      return !!this.form.other;
    },
    isURLValid() {
      return this.regex.test(this.form.meetingLink);
    },
    isFileSizeValid() {
      return this.dropzoneFile.size < 30000000;
    },
  },
  methods: {
    ...mapActions(["getMyPolls"]),
    calculateRemainingDay(date) {
      return Math.round(
        (new Date(date) - new Date(Date.now())) / (24 * 60 * 60 * 1000)
      ) < 0
        ? 0
        : Math.round(
            (new Date(date) - new Date(Date.now())) / (24 * 60 * 60 * 1000)
          );
    },
    onFocus() {
      document.getElementById("search-input-confirmed").placeholder =
        this.text["confirmed"]["focusSearch"];
    },
    onBlur() {
      document.getElementById("search-input-confirmed").placeholder =
        this.text["confirmed"]["placeholder"];
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
    triggerFillToTime() {
      var bits = this.form.from.split(/[- :]/);
      var date = new Date();
      date.setHours(bits[0], bits[1], 0);
      var minuteDuration = this.selectedInbox.duration_of_time * 60;
      var endTimeHour;
      var endTimeMinute;
      var endTime;
      if (minuteDuration % 60 != 0) {
        endTimeMinute = ((date.getMinutes() + minuteDuration) % 60)
          .toString()
          .padStart(2, "0");
        endTimeHour =
          date.getHours() +
            Math.floor((date.getMinutes() + minuteDuration) / 60) <
          12
            ? `${
                date.getHours() +
                Math.floor((date.getMinutes() + minuteDuration) / 60)
              }`.padStart(2, "0")
            : date.getHours() +
                Math.floor((date.getMinutes() + minuteDuration) / 60) >=
              24
            ? (
                date.getHours() +
                Math.floor((date.getMinutes() + minuteDuration) / 60) -
                24
              )
                .toString()
                .padStart(2, "0")
            : date.getHours() +
              Math.floor((date.getMinutes() + minuteDuration) / 60);
      } else {
        endTimeMinute = date.getMinutes().toString().padStart(2, "0");
        endTimeHour =
          date.getHours() + this.selectedInbox.duration_of_time < 12
            ? `${
                date.getHours() + this.selectedInbox.duration_of_time
              }`.padStart(2, "0")
            : `${date.getHours() + this.selectedInbox.duration_of_time}`;
      }
      endTime = `${endTimeHour}:${endTimeMinute}`;
      this.form.to = endTime;
    },
    formatDateTime(dateTime) {
      return formatDateTimeDetail(dateTime);
    },
    formatDateTimeHeader(dateTime, lang) {
      return formatDateTimeHeader(dateTime, lang);
    },
    formatFileSize(byte, decimal) {
      return formatBytes(byte, decimal ? decimal : 2);
    },
    async selectInbox(id) {
      this.selectedInbox = null;
      this.selectedId = id;
      this.isLoading = true;
      this.selectedInbox = await this.$store.dispatch(
        "getMyResultDetail",
        this.selectedId
      );
      if (this.selectedInbox) {
        this.expiredCount = this.calculateRemainingDay(
          this.selectedInbox.slots[0].date
        );
      }
      this.isLoading = false;
    },
    onClickShowSchedule(date, index) {
      this.acceptedArray = [];
      this.splitArray = [];
      this.isShowSchedule = true;
      this.form.date = date.split("T")[0];
      let slotIndex = index;
      var temp = [];
      var temp2 = [];
      if ("accepted" in this.selectedInbox.slots[slotIndex].responses[0]) {
        for (
          let index = 0;
          index <
          this.selectedInbox.slots[slotIndex].responses[0].accepted.length;
          index++
        ) {
          temp.push(
            this.selectedInbox.slots[slotIndex].responses[0].accepted[index]
          );
          if (
            this.selectedInbox.slots[slotIndex].responses[0].accepted.length > 0
          ) {
            temp2.push({
              id: this.selectedInbox.slots[slotIndex].responses[0].accepted[
                index
              ].executive_id,
              label:
                this.selectedInbox.slots[slotIndex].responses[0].accepted[index]
                  .first_name +
                " " +
                this.selectedInbox.slots[slotIndex].responses[0].accepted[
                  index
                ].last_name.substr(0, 1) +
                ".",
            });
          }
        }
        if ("declined" in this.selectedInbox.slots[slotIndex].responses[0]) {
          for (
            let index = 0;
            index <
            this.selectedInbox.slots[slotIndex].responses[0].declined.length;
            index++
          ) {
            if (
              this.selectedInbox.slots[slotIndex].responses[0].declined.length >
              0
            ) {
              temp2.push({
                id: this.selectedInbox.slots[slotIndex].responses[0].declined[
                  index
                ].executive_id,
                label:
                  this.selectedInbox.slots[slotIndex].responses[0].declined[
                    index
                  ].first_name +
                  " " +
                  this.selectedInbox.slots[slotIndex].responses[0].declined[
                    index
                  ].last_name.substr(0, 1) +
                  ".",
              });
            }
          }
        }
        if ("notResponse" in this.selectedInbox.slots[slotIndex].responses[0]) {
          for (
            let index = 0;
            index <
            this.selectedInbox.slots[slotIndex].responses[0].notResponse.length;
            index++
          ) {
            if (
              "notResponse" in this.selectedInbox.slots[slotIndex].responses[0]
            ) {
              if (
                this.selectedInbox.slots[slotIndex].responses[0].notResponse
                  .length > 0
              ) {
                temp2.push({
                  id: this.selectedInbox.slots[slotIndex].responses[0]
                    .notResponse[index].executive_id,
                  label:
                    this.selectedInbox.slots[slotIndex].responses[0]
                      .notResponse[index].first_name +
                    " " +
                    this.selectedInbox.slots[
                      slotIndex
                    ].responses[0].notResponse[index].last_name.substr(0, 1) +
                    ".",
                });
              }
            }
          }
        }
      }

      for (let index = 0; index < temp.length; index++) {
        for (let i = 0; i < temp[index].periodOfTime.length; i++) {
          this.acceptedArray.push(temp[index].periodOfTime[i]);
        }
      }
      this.splitDays = temp2;
      this.getOverlaps(this.acceptedArray);
    },
    onClickCloseSchedule() {
      this.removeFile();
      this.isShowSchedule = false;
      this.form.title = null;
      this.form.description = null;
      this.form.date = null;
      this.form.from = null;
      this.form.to = null;
      this.form.location = "";
      this.form.other = null;
      this.form.meetingLink = null;
      this.dropzoneFile = "";
      this.errors = {};
    },
    getDateObj(s, isTime = false) {
      var bits = s.split(/[- :]/);
      var date = new Date(bits[0], bits[1] - 1, bits[2]);
      date.setHours(bits[3], bits[4], 0);
      if (isTime == false) {
        return date;
      } else {
        return (
          date.getHours().toString().padStart(2, "0") +
          ":" +
          date.getMinutes().toString().padEnd(2, "0")
        );
      }
    },
    getOverlaps(events) {
      events.sort((a, b) => {
        return this.getDateObj(a.start) - this.getDateObj(b.start);
      });
      var results = [];
      if (events.length <= 1) {
        results = [
          {
            id:
              this.getDateObj(events[0].start, true) +
              " - " +
              this.getDateObj(events[0].end, true),
            eventCount: 1,
            toString: function () {
              return "[id:" + this.id + ", events:" + this.eventCount + "]";
            },
          },
        ];
      } else {
        for (var i = 0, l = events.length; i < l; i++) {
          var oEvent = events[i];
          var nOverlaps = 0;
          for (var j = 0; j < l; j++) {
            var oCompareEvent = events[j];
            if (
              (oCompareEvent.start < oEvent.end &&
                oCompareEvent.end > oEvent.start) ||
              (oCompareEvent.end <= oEvent.start &&
                oCompareEvent.start > oEvent.end)
            ) {
              nOverlaps++;
            }
          }
          if (nOverlaps > 1) {
            results.push({
              id:
                this.getDateObj(oEvent.start, true) +
                " - " +
                this.getDateObj(oEvent.end, true),
              eventCount: nOverlaps,
              toString: function () {
                return "[id:" + this.id + ", events:" + this.eventCount + "]";
              },
            });
          }
        }
      }
      const keys = ["id"];
      const filteredData = results
        .filter(
          (value, index, self) =>
            self.findIndex((v) => keys.every((k) => v[k] === value[k])) ===
            index
        )
        .sort((a, b) => (a.eventCount < b.eventCount ? 1 : -1));
      this.bestTimeSlot = filteredData;
    },
    async handleCreateMeeting() {
      this.titleIsValid
        ? delete this.errors.title
        : (this.errors.title = this.text['errors']['title']);
      this.descriptionIsValid
        ? delete this.errors.description
        : (this.errors.description = this.text['errors']['description']);
      this.fromIsValid
        ? delete this.errors.from
        : (this.errors.from = this.text['errors']['fromTime']);
      this.locationIsValid
        ? delete this.errors.location
        : (this.errors.location = this.text['errors']['location']);
      if (this.form.location == "Others") {
        this.otherIsValid
          ? delete this.errors.other
          : (this.errors.other = this.text['errors']['otherLocation']);
        if (this.form.meetingLink) {
          this.isURLValid
            ? delete this.errors.meetingLink
            : (this.errors.meetingLink = this.text['errors']['urlNotValid']);
        }
      }
      if (this.form.location != "Others") {
        if (this.meetingLinkIsValid) {
          delete this.errors.meetingLink;
          this.isURLValid
            ? delete this.errors.meetingLink
            : (this.errors.meetingLink = this.text['errors']['urlNotValid']);
        } else {
          this.errors.meetingLink = this.text['errors']['url'];
        }
      } else {
        delete this.errors.meetingLink;
      }
      if (this.dropzoneFile) {
        this.isFileSizeValid
          ? delete this.errors.fileSize
          : (this.errors.fileSize = this.text['errors']['fileSize']);
      } else {
        delete this.errors.fileSize;
      }
      // eslint-disable-next-line
      if (Object.keys(this.errors).length == 0) {
        var currentdate = new Date();
        var createTime = `${currentdate.getFullYear()}-${(
          "0" +
          (currentdate.getMonth() + 1)
        ).slice(-2)}-${("0" + currentdate.getDate()).slice(
          -2
        )} ${currentdate.getHours()}:${("0" + currentdate.getMinutes()).slice(
          -2
        )}:${currentdate.getSeconds()}`;
        let meeting = {
          id: this.selectedId,
          title: this.form.title,
          description: this.form.description,
          create_at: createTime,
          date: this.form.date,
          start: this.form.from,
          end: this.form.to,
          location: this.form.location,
          otherLocation: this.form.other,
          meetingLink: this.form.meetingLink,
        };
        this.isLoadingSend = true;
        await this.$store
          .dispatch("createMeeting", {
            newMeeting: meeting,
            file: this.dropzoneFile ? this.dropzoneFile : null,
          })
          .then(() => {
            this.isLoadingSend = false;
            this.selectedInbox = null;
            this.selectedId = null;
          });
        this.onClickCloseSchedule();
      } else {
        location.href = "#top";
      }
    },
  },
  created() {
    this.getMyPolls();
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
.expired {filter: grayscale(1);opacity: 0.5;pointer-events: none;}
.readonly {background-color: $grey !important;}
.required {color: $error;margin-top: 0.8rem;font-size: 1.4rem !important;}
.optional-field {color: $darkGrey;}
.modal,.modal-loading {width: 100%;height: 100vh;position: fixed;background-color: rgba(24, 24, 26, 0.4);z-index: 11;display: flex;flex-direction: column;align-items: center;justify-content: center;}
.modal-loading {z-index: 15 !important;width: 100%;height: 100vh;position: fixed;background-color: rgba(24, 24, 26, 0.4);display: flex;flex-direction: column;align-items: center;justify-content: center;.pop-up-loading {position: fixed;z-index: 12;padding: 2.4rem 1.6rem;color: $darkViolet;.flex-col-center {animation-name: floating;-webkit-animation-name: floating;animation-duration: 2s;-webkit-animation-duration: 2s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.logo {.primary-violet {color: $primaryViolet;}.yellow {color: $yellow;}.faded-violet {color: $fadedViolet;}}.image {width: 15rem;height: 15rem;img {width: 100%;height: 100%;}}}.loading {animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}}
.container-cust {top: 50%;left: 50%;transform: translate(-50%, -50%);position: fixed;z-index: 12;width: 95% !important;height: fit-content;display: grid;grid-template-columns: 1.25fr 0.75fr;column-gap: 2rem;animation-name: appears;animation-duration: 0.5s;animation-iteration-count: 1;.first-col {display: flex;flex-direction: column;row-gap: 2rem;.suggested-time {width: 100%;height: 7.4rem;background-color: $white;border-radius: 2rem;display: flex;padding: 1rem 3.6rem;align-items: center;column-gap: 1rem;.time-slot {cursor: grab;overflow-x: scroll;white-space: nowrap;display: flex;column-gap: 1.6rem;.slot {width: fit-content;background-color: $primaryViolet;padding: 1rem 2rem;color: $white;border-radius: 1rem;}}}.calendar {width: 100%;height: 60rem;overflow: scroll;background-color: $white;border-radius: 2rem;}}.second-col {width: 100%;height: 69rem;background-color: $white;border-radius: 2.5rem;padding: 3.6rem 3.2rem;display: flex;flex-direction: column;justify-content: center;align-items: center;.form {width: 100%;overflow-y: scroll;.optional {margin-top: 3.6rem;background-color: $bgColor;color: $highlightViolet;border-radius: 1.4rem;padding: 0.6rem 1.2rem;width: fit-content;}.duration-container {display: flex;justify-content: space-between;align-items: center;.bold-content-text {color: $primaryViolet;}.duration {width: fit-content;background-color: $fadedYellow;padding: 1rem 1.4rem;border-radius: 1.6rem;color: $yellow;}}}.attachment-download {width: 25rem;border-radius: 0.5rem;padding: 1rem 1.4rem;background-color: $primaryGrey;display: flex;row-gap: 1.5rem;align-items: center;margin: 1.6rem 0rem 1rem 0rem;.file-section {display: flex;justify-content: space-between;align-items: center;column-gap: 2rem;width: 100%;.first-section {display: flex;column-gap: 1rem;align-items: center;.file-icon {display: flex;justify-content: center;align-items: center;width: 4rem;height: 4rem;border-radius: 0.5rem;background-color: $white;color: $primaryViolet;font-size: 1.6rem;}.file-details {display: flex;flex-direction: column;.file-name {color: $darkViolet;}.file-size {color: $darkGrey;}}}.file-delete {cursor: pointer;font-size: 1.6rem;color: $darkGrey;transition: all ease-in-out 0.2s;&:hover {color: $error;}}}}.button {margin-top: 1.8rem;display: flex;justify-content: flex-end;width: 100%;column-gap: 1rem;}.row-input {display: flex;flex-wrap: wrap;justify-content: space-between;width: 100%;.input-form {margin: 0rem;}}.input-form {display: flex;flex-direction: column;margin: 1.6rem 0rem;select {font-size: 1.4rem;}select,input {margin-top: 1rem;padding: 1rem 1.4rem;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}textarea {margin-top: 1rem;padding: 1rem 1.4rem;height: 12rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;resize: none;}select:focus,input:focus,textarea:focus {outline: none;border: 0.1rem solid $primaryViolet;}select::placeholder,input::placeholder,textarea::placeholder {font-size: 1.4rem;color: $darkGrey;}}}}
.result {display: flex;flex-direction: column;row-gap: 3rem;height: 50rem;overflow: scroll;margin: 1rem 0;padding: 0 1rem;.row-header {display: flex;align-items: center;justify-content: space-between;.bold-content-text {color: $darkViolet;margin-bottom: 2rem;}}}
.result::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1rem;}
.result::-webkit-scrollbar-track {margin: 1rem;border-radius: 0.5rem;}
.result::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}
.result::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}
.to-be-confirmed-body-section {display: grid;grid-template-columns: 0.35fr 0.65fr;column-gap: 2.2rem;padding: 3rem;.inbox {width: 100%;height: 100%;border-radius: 2.2rem;display: flex;flex-direction: column;row-gap: 1rem;position: relative;.filter-show {display: flex;justify-content: space-between;color: $highlightViolet;margin: 0.4rem 0;}.filter {display: flex;column-gap: 0.5rem;.filter-list {min-width: 4rem;min-height: 4rem;background-color: $primaryViolet;border-radius: 1rem;display: flex;align-items: center;justify-content: center;cursor: pointer;transition: 0.3s all ease-in-out;.alert {transform: translateX(0.4rem) translateY(-0.4rem);top: 0%;right: 0%;min-width: 1rem;min-height: 1rem;position: absolute;border-radius: 50%;background-color: $yellow;outline: 0.2rem solid $white;}.icon {font-size: 1.4rem;color: $white;}&:hover {background-color: $darkViolet;}}.dropdown__content {box-shadow: 0px 0px 5px $fadedViolet;z-index: -1;display: flex;flex-direction: column;align-items: center;margin-top: 3rem;position: absolute;right: 0%;opacity: 0;width: 100%;background-color: $white;padding: 2.8rem;transition: 0.3s all ease-in-out;border-radius: 1.5rem;cursor: auto;&.is-show {transform: translateY(2rem);opacity: 1;z-index: 1;cursor: pointer;}input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}}}.search-filter {position: relative;width: 100%;display: flex;align-items: center;justify-items: center;.input-icon {width: 100%;display: flex;align-items: center;justify-items: center;input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $white;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}.icon {position: absolute;right: 0;font-size: 1.4rem;margin-right: 1rem;color: $darkGrey;}}}.inbox-list {height: 62.5rem;width: 100%;background-color: $white;border-radius: 2.2rem;overflow: scroll;.not-found {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 80%;text-align: center;color: $darkGrey;}}}.inbox-detail {width: 100%;height: 100%;background-color: $white;border-radius: 2.5rem;padding: 5rem 4.4rem;display: flex;flex-direction: column;.not-found {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 80%;text-align: center;color: $darkGrey;}.loading {animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.inbox-detail-content {overflow: scroll;.due-date {margin: 2rem 0;color: $primaryViolet;line-height: 1.6;span {color: $error;}}.sent-from {color: $darkGrey;span {text-decoration: underline;}}.button {display: flex;justify-content: flex-end;}}.line {margin: 2.4rem 0;width: 100%;height: 0.1rem;background-color: $grey;}}}
</style>