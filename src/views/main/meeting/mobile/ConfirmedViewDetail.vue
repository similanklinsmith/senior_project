<template>
  <div v-if="!isLoading && inboxDetail != null">
    <MaskMeetingDetailMobile
      :title="inboxDetail.title"
      :dateTime="inboxDetail.create_at"
      :type="type"
      :sender="'TEST'"
    >
      <template v-slot:detail-slot>
        <div class="bold-small-text due-date">
          <span>*</span>This poll meeting will be expired in
          {{ inboxDetail.slots[0].date.split("T")[0] }}
          <span v-if="new Date(inboxDetail.slots[0].date) >= new Date()"
            >({{ expiredCount }} days left)</span
          >
          <span v-else>(Already expired)</span>
        </div>
        <div
          class="result"
          :class="`${
            new Date(inboxDetail.slots[0].date) < new Date() ? 'expired' : ''
          }`"
        >
          <div v-for="(slot, index) in inboxDetail.slots" :key="index">
            <div class="row-header">
              <div class="bold-content-text">
                {{ formatDateTimeHeader(slot.date) }}
              </div>
              <div
                :style="
                  'accepted' in slot.responses[0]
                    ? {}
                    : { 'pointer-events': 'none', filter: 'grayscale(1)' }
                "
              >
                <BaseButton
                  buttonType="common-button"
                  btnText="Show schedule"
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
          <div class="container">
            <div class="first-col">
              <div class="suggested-time">
                <div class="bold-content-text">Suggested time</div>
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
              <div class="calendar" v-if="isShowCalendar">
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
              <BaseButton
                v-if="isShowCalendar"
                buttonType="common-button"
                btnText="Close calendar"
                textColor="white"
                textHover="white"
                color="#F33C3C"
                hoverColor="#d93333"
                width="100%"
                @click="isShowCalendar = false"
              >
                <template v-slot:after-icon>
                  <i class="fa-solid fa-xmark"></i>
                </template>
              </BaseButton>
              <BaseButton
                v-else
                buttonType="common-button"
                btnText="Show calendar"
                textColor="#7452FF"
                textHover="white"
                color="#DBD2FF"
                hoverColor="#7452FF"
                width="100%"
                @click="isShowCalendar = true"
              >
                <template v-slot:after-icon>
                  <i class="fa-regular fa-calendar"></i>
                </template>
              </BaseButton>
            </div>
            <div class="second-col" v-if="isShowCalendar == false">
              <div class="form">
                <div class="duration-container">
                  <div class="bold-content-text">Create meeting</div>
                  <div class="duration bold-small-text">
                    Required duration
                    {{
                      inboxDetail.duration_of_time.toString().split(".")[0]
                    }}hr
                    <span
                      v-if="
                        inboxDetail.duration_of_time.toString().split('.')[1]
                      "
                      >{{
                        parseInt(
                          inboxDetail.duration_of_time.toString().split(".")[1]
                        ) * 6
                      }}min</span
                    >
                  </div>
                </div>
                <form @submit.prevent="handleCreateMeeting">
                  <div class="input-form" id="top">
                    <label for="title" class="bold-small-text"
                      >Title<span class="required">*</span></label
                    >
                    <input
                      class="small-text"
                      type="text"
                      placeholder="Title"
                      id="title"
                      name="title"
                      v-model.trim="form.title"
                    />
                    <div class="required bold-small-text">
                      {{ errors.title }}
                    </div>
                  </div>
                  <div class="input-form">
                    <label for="description" class="bold-small-text"
                      >Description<span class="required">*</span></label
                    >
                    <textarea
                      class="small-text"
                      type="text"
                      placeholder="Description"
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
                      <label for="date" class="bold-small-text">Date</label>
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
                        >From<span class="required">*</span></label
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
                      <label for="to" class="bold-small-text">To</label>
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
                      >Location<span class="required">*</span></label
                    >
                    <select
                      name="location"
                      id="location"
                      v-model="form.location"
                    >
                      <option value="">none</option>
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
                      >Other Location<span class="required">*</span></label
                    >
                    <input
                      class="small-text"
                      type="text"
                      placeholder="room number or any platforms"
                      id="other"
                      name="other"
                      v-model="form.other"
                    />
                    <div class="required bold-small-text">
                      {{ errors.other }}
                    </div>
                  </div>
                  <div class="input-form" v-if="form.location != ''">
                    <label for="link" class="bold-small-text"
                      >Meeting Link<span
                        v-if="form.location != 'Others'"
                        class="required"
                        >*</span
                      ><span v-else class="optional-field">(Optional)</span>
                    </label>
                    <input
                      class="small-text"
                      type="text"
                      placeholder="www.example-link.com"
                      id="link"
                      name="link"
                      v-model="form.meetingLink"
                    />
                    <div class="required bold-small-text">
                      {{ errors.meetingLink }}
                    </div>
                  </div>
                  <div class="bold-small-text optional">Optional</div>
                  <div class="input-form" v-if="!dropzoneFile">
                    <BaseDropZone @drop.prevent="drop" @change="selectedFile" />
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
                  <div class="button">
                    <BaseButton
                      buttonType="outlined-button"
                      btnText="Cancel"
                      textColor="#F33C3C"
                      textHover="white"
                      color="#F33C3C"
                      hoverColor="#F33C3C"
                      @onClick="onClickCloseSchedule"
                    />
                    <BaseButton
                      buttonType="common-button"
                      btnText="Create meeting"
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
      </template>
    </MaskMeetingDetailMobile>
  </div>
  <BaseNotFound v-else :isFailed="isFailed" />
</template>

<script>
import MaskMeetingDetailMobile from "@/components/meeting/MaskMeetingDetailMobile.vue";
import BaseNotFound from "@/components/UI/BaseNotFound.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseDropZone from "@/components/UI/BaseDropZone.vue";
import ResultComp from "@/components/meeting/ResultComp.vue";
import { mapGetters, mapActions } from "vuex";
import { useRoute } from "vue-router";
import { formatDateTimeHeader } from "@/helpers/formatDateTime";
import { formatBytes } from "@/helpers/formatFileSize";
import VueCal from "vue-cal";
import { ref } from "vue";
export default {
  name: "BeConfirmedViewDetail",
  components: {
    MaskMeetingDetailMobile,
    BaseButton,
    BaseNotFound,
    BaseDropZone,
    ResultComp,
    VueCal,
  },
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const type = route.params.type;
    let dropzoneFile = ref("");
    const drop = (e) => {
      dropzoneFile.value = e.dataTransfer.files[0];
    };
    const selectedFile = () => {
      dropzoneFile.value = document.querySelector(".dropzoneFile").files[0];
      console.log(dropzoneFile);
    };
    const removeFile = () => {
      dropzoneFile.value = null;
    };
    return { id, type, dropzoneFile, drop, selectedFile, removeFile };
  },
  data() {
    return {
      isFailed: false,
      isShowCalendar: false,
      isLoading: false,
      acceptedArray: [],
      toBeConfirmedList: [],
      inboxDetail: null,
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
        other: "",
        meetingLink: "",
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
    ...mapGetters(["getterMyReplyDetail"]),
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
  },
  methods: {
    ...mapActions(["getMyResultDetail"]),
    calculateRemainingDay(date) {
      return Math.round(
        (new Date(date) - new Date(Date.now())) / (24 * 60 * 60 * 1000)
      ) < 0
        ? 0
        : Math.round(
            (new Date(date) - new Date(Date.now())) / (24 * 60 * 60 * 1000)
          );
    },
    triggerFillToTime() {
      var bits = this.form.from.split(/[- :]/);
      var date = new Date();
      date.setHours(bits[0], bits[1], 0);
      var minuteDuration = this.inboxDetail.duration_of_time * 60;
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
          date.getHours() + this.inboxDetail.duration_of_time < 12
            ? `${date.getHours() + this.inboxDetail.duration_of_time}`.padStart(
                2,
                "0"
              )
            : `${date.getHours() + this.inboxDetail.duration_of_time}`;
      }
      endTime = `${endTimeHour}:${endTimeMinute}`;
      this.form.to = endTime;
    },
    formatFileSize(byte, decimal) {
      return formatBytes(byte, decimal ? decimal : 2);
    },
    onClickShowSchedule(date, index) {
      this.acceptedArray = [];
      this.splitArray = [];
      this.isShowSchedule = true;
      this.form.date = date.split("T")[0];
      let slotIndex = index;
      var temp = [];
      var temp2 = [];
      if ("accepted" in this.inboxDetail.slots[slotIndex].responses[0]) {
        for (
          let index = 0;
          index <
          this.inboxDetail.slots[slotIndex].responses[0].accepted.length;
          index++
        ) {
          temp.push(
            this.inboxDetail.slots[slotIndex].responses[0].accepted[index]
          );
          if (
            this.inboxDetail.slots[slotIndex].responses[0].accepted.length > 0
          ) {
            temp2.push({
              id: this.inboxDetail.slots[slotIndex].responses[0].accepted[index]
                .executive_id,
              label:
                this.inboxDetail.slots[slotIndex].responses[0].accepted[index]
                  .first_name +
                " " +
                this.inboxDetail.slots[slotIndex].responses[0].accepted[
                  index
                ].last_name.substr(0, 1) +
                ".",
            });
          }
        }
        if ("declined" in this.inboxDetail.slots[slotIndex].responses[0]) {
          for (
            let index = 0;
            index <
            this.inboxDetail.slots[slotIndex].responses[0].declined.length;
            index++
          ) {
            if (
              this.inboxDetail.slots[slotIndex].responses[0].declined.length > 0
            ) {
              temp2.push({
                id: this.inboxDetail.slots[slotIndex].responses[0].declined[
                  index
                ].executive_id,
                label:
                  this.inboxDetail.slots[slotIndex].responses[0].declined[index]
                    .first_name +
                  " " +
                  this.inboxDetail.slots[slotIndex].responses[0].declined[
                    index
                  ].last_name.substr(0, 1) +
                  ".",
              });
            }
          }
        }
        if ("notResponse" in this.inboxDetail.slots[slotIndex].responses[0]) {
          for (
            let index = 0;
            index <
            this.inboxDetail.slots[slotIndex].responses[0].notResponse.length;
            index++
          ) {
            if (
              "notResponse" in this.inboxDetail.slots[slotIndex].responses[0]
            ) {
              if (
                this.inboxDetail.slots[slotIndex].responses[0].notResponse
                  .length > 0
              ) {
                temp2.push({
                  id: this.inboxDetail.slots[slotIndex].responses[0]
                    .notResponse[index].executive_id,
                  label:
                    this.inboxDetail.slots[slotIndex].responses[0].notResponse[
                      index
                    ].first_name +
                    " " +
                    this.inboxDetail.slots[slotIndex].responses[0].notResponse[
                      index
                    ].last_name.substr(0, 1) +
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
      console.log(this.acceptedArray);
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
      console.log(events);
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
              (oCompareEvent.start <= oEvent.end &&
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
      console.log(this.bestTimeSlot);
    },
    handleCreateMeeting() {
      this.titleIsValid
        ? delete this.errors.title
        : (this.errors.title = "Please inform title");
      this.descriptionIsValid
        ? delete this.errors.description
        : (this.errors.description = "Please inform description");
      this.fromIsValid
        ? delete this.errors.from
        : (this.errors.from = "Please choose");
      this.locationIsValid
        ? delete this.errors.location
        : (this.errors.location = "Please inform location");
      if (this.form.location == "Others") {
        this.otherIsValid
          ? delete this.errors.other
          : (this.errors.other = "Please inform other location");
        if (this.form.meetingLink) {
          this.isURLValid
            ? delete this.errors.meetingLink
            : (this.errors.meetingLink = "URL link is invalid");
        }
      }
      if (this.form.location != "Others") {
        if (this.meetingLinkIsValid) {
          delete this.errors.meetingLink;
          this.isURLValid
            ? delete this.errors.meetingLink
            : (this.errors.meetingLink = "URL link is invalid");
        } else {
          this.errors.meetingLink = "Please inform meeting link";
        }
      } else {
        delete this.errors.meetingLink;
      }
      console.log(this.errors);
      // eslint-disable-next-line
      if (Object.keys(this.errors).length == 0) {
        // create meeting
        let meeting = {
          title: this.form.title,
          description: this.form.description,
          date: this.form.date,
          start: this.form.from,
          end: this.form.to,
          location: this.form.location,
          otherLocation: this.form.other,
          meetingLink: this.form.meetingLink,
          file: this.dropzoneFile,
        };
        console.log(
          "🚀 ~ file: ConfirmedView.vue ~ line 812 ~ handleCreateMeeting ~ meeting",
          meeting
        );
      } else {
        location.href = "#top";
      }
    },
    async getConfirmedDetail() {
      try {
        this.inboxDetail = await this.$store.dispatch(
          "getMyResultDetail",
          this.id
        );
        this.expiredCount = this.calculateRemainingDay(
          this.inboxDetail.slots[0].date
        );
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.isFailed = true;
      }
    },
    formatDateTimeHeader(dateTime) {
      return formatDateTimeHeader(dateTime);
    },
  },
  created() {
    console.log(`This is params id: ${this.id}`);
    console.log(`This is params type: ${this.type}`);
    this.getConfirmedDetail();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
@media (min-width: 27em) {
  .expired-date {
    font-size: 1.6rem !important;
  }
}
.readonly {
  background-color: $grey !important;
}
.required {
  color: $error;
  margin-top: 0.8rem;
  font-size: 1.4rem !important;
}
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
.container {
  margin: 5rem 5%;
  position: fixed;
  z-index: 12;
  width: 90% !important;
  height: 90% !important;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  animation-name: appears;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  .first-col {
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
    .suggested-time {
      width: 100%;
      height: 7.4rem;
      background-color: $white;
      border-radius: 2rem;
      display: flex;
      padding: 1rem 3.6rem;
      align-items: center;
      column-gap: 1rem;
      .time-slot {
        cursor: grab;
        overflow-x: scroll;
        white-space: nowrap;
        display: flex;
        column-gap: 1.6rem;
        .slot {
          width: fit-content;
          background-color: $primaryViolet;
          padding: 1rem 2rem;
          color: $white;
          border-radius: 1rem;
        }
      }
    }
    .calendar {
      width: 100%;
      height: 90rem;
      overflow: scroll;
      background-color: $white;
      border-radius: 2rem;
    }
  }
  .second-col {
    width: 100%;
    height: 80%;
    background-color: $white;
    border-radius: 2.5rem;
    padding: 3.6rem 3.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .form {
      width: 100%;
      overflow-y: scroll;
      .optional {
        margin-top: 3.6rem;
        background-color: $bgColor;
        color: $highlightViolet;
        border-radius: 1.4rem;
        padding: 0.6rem 1.2rem;
        width: fit-content;
      }
      .duration-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .bold-content-text {
          color: $primaryViolet;
        }
        .duration {
          width: fit-content;
          background-color: $fadedYellow;
          padding: 1rem 1.4rem;
          border-radius: 1.6rem;
          color: $yellow;
        }
      }
    }
    .attachment-download {
      width: 25rem;
      border-radius: 0.5rem;
      padding: 1rem 1.4rem;
      background-color: $primaryGrey;
      display: flex;
      row-gap: 1.5rem;
      align-items: center;
      .file-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: 2rem;
        width: 100%;
        .first-section {
          display: flex;
          column-gap: 1rem;
          align-items: center;
          .file-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 4rem;
            height: 4rem;
            border-radius: 0.5rem;
            background-color: $white;
            color: $primaryViolet;
            font-size: 1.6rem;
          }
          .file-details {
            display: flex;
            flex-direction: column;
            .file-name {
              color: $darkViolet;
            }
            .file-size {
              color: $darkGrey;
            }
          }
        }
        .file-delete {
          cursor: pointer;
          font-size: 1.6rem;
          color: $darkGrey;
          transition: all ease-in-out 0.2s;
          &:hover {
            color: $error;
          }
        }
      }
    }
    .button {
      margin-top: 1.8rem;
      display: flex;
      justify-content: flex-end;
      width: 100%;
      column-gap: 1rem;
    }
    .row-input {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      .input-form {
        margin: 0rem;
      }
    }
    .input-form {
      display: flex;
      flex-direction: column;
      margin: 1.6rem 0rem;
      select {
        font-size: 1.4rem;
      }
      select,
      input {
        margin-top: 1rem;
        padding: 1rem 1.4rem;
        height: 4rem;
        border-radius: 0.5rem;
        border: none;
        background-color: $primaryGrey;
        font-family: "Poppins", sans-serif;
      }
      textarea {
        margin-top: 1rem;
        padding: 1rem 1.4rem;
        height: 12rem;
        border-radius: 0.5rem;
        border: none;
        background-color: $primaryGrey;
        font-family: "Poppins", sans-serif;
        resize: none;
      }
      select:focus,
      input:focus,
      textarea:focus {
        outline: none;
        border: 0.1rem solid $primaryViolet;
      }
      select::placeholder,
      input::placeholder,
      textarea::placeholder {
        font-size: 1.4rem;
        color: $darkGrey;
      }
    }
  }
}
.due-date {
  margin: 2rem 0;
  color: $primaryViolet;
  span {
    color: $error;
  }
}
.loading {
  height: 100vh;
  color: $highlightViolet;
  animation-name: floating;
  -webkit-animation-name: floating;
  animation-duration: 3s;
  -webkit-animation-duration: 3s;
  animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
}
.expired {
  filter: grayscale(1);
  opacity: 0.5;
  pointer-events: none;
}
.expired-date {
  font-size: 2rem;
  font-weight: 500;
  color: $primaryViolet;
  line-height: 1.6;
  span {
    color: $error;
  }
}
.result {
  display: flex;
  flex-direction: column;
  row-gap: 3rem;
  height: 100%;
  overflow: scroll;
  margin: 1rem 0;
  padding: 0 1rem;
  .row-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .bold-content-text {
      color: $darkViolet;
      margin-bottom: 2rem;
    }
  }
}
.result::-webkit-scrollbar {
  display: block !important;
  -ms-overflow-style: auto !important;
  scrollbar-width: auto !important;
  background-color: transparent;
  width: 1rem;
}
.result::-webkit-scrollbar-track {
  margin: 1rem;
  border-radius: 0.5rem;
}
.result::-webkit-scrollbar-thumb {
  background-color: $grey;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}
.result::-webkit-scrollbar-thumb:hover {
  background-color: $darkGrey;
}
</style>