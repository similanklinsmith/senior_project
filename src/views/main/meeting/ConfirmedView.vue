<template>
  <div class="to-be-confirmed-body-section">
    <div class="inbox">
      <div class="search-filter">
        <div class="input-icon">
          <i class="icon fa-solid fa-magnifying-glass"></i>
          <input
            class="small-text"
            type="text"
            placeholder="Search by title"
            v-model="searchInput"
          />
        </div>
      </div>
      <div class="inbox-list">
        <transition-group name="route">
          <InboxComp
            v-for="inbox in filterByTitle"
            :key="inbox.id"
            :id="inbox.id"
            :title="inbox.title"
            :content="inbox.content"
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
      <div class="inbox-detail" v-if="selectedInbox != null">
        <div class="title remark-text">{{ selectedInbox.title }}</div>
        <div class="sent-from smallest-text">
          completed on {{ formatDateTime(selectedInbox.create_at) }}
        </div>
        <div class="result">
          <div v-for="slot in selectedInbox.slots" :key="slot.id">
            <div class="row-header">
              <div class="bold-content-text">
                {{ formatDateTimeHeader(slot.date) }}
              </div>
              <BaseButton
                buttonType="common-button"
                btnText="Show schedule"
                textColor="white"
                textHover="white"
                color="#7452FF"
                hoverColor="#23106D"
                width="fit-content"
                @click="onClickShowSchedule(slot.date, slot.id)"
              >
              </BaseButton>
            </div>
            <ResultComp
              v-for="res in slot.responses"
              :key="res.id"
              :response="res"
            />
          </div>
        </div>
        <teleport to="#portal-target" v-if="isShowSchedule">
          <div class="modal" @click="onClickCloseSchedule"></div>
          <div class="container">
            <div class="first-col">
              <div class="suggested-time">
                <div class="bold-content-text">Suggested time</div>
                <div class="time-slot">
                  <div class="slot" v-for="slot in bestTimeSlot" :key="slot">
                    <div class="bold-smallest-text">
                      {{ slot.id }} ({{ slot.eventCount }})
                    </div>
                  </div>
                </div>
              </div>
              <div class="calendar">
                <vue-cal
                  class="vuecal--violet-theme vuecal--disabled-button"
                  :selected-date="selectedDate"
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
                  <div class="duration bold-small-text">
                    Required duration
                    {{
                      selectedInbox.duration_of_time.toString().split(".")[0]
                    }}hr
                    <span
                      v-if="
                        selectedInbox.duration_of_time.toString().split('.')[1]
                      "
                      >{{
                        parseInt(
                          selectedInbox.duration_of_time
                            .toString()
                            .split(".")[1]
                        ) * 6
                      }}min</span
                    >
                  </div>
                </div>
                <form @submit.prevent="handleCreateMeeting">
                  <div class="input-form">
                    <label for="title" class="bold-small-text"
                      >Title<span class="required">*</span></label
                    >
                    <input
                      class="small-text"
                      type="text"
                      placeholder="Title"
                      id="title"
                      name="title"
                    />
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
                    />
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
                        :value="selectedDate"
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
                      />
                    </div>
                    <div class="input-form">
                      <label for="to" class="bold-small-text"
                        >To<span class="required">*</span></label
                      >
                      <input
                        class="small-text"
                        type="time"
                        placeholder="HH:MM"
                        id="to"
                        name="to"
                      />
                    </div>
                  </div>
                  <div class="input-form">
                    <label for="location" class="bold-small-text"
                      >Location<span class="required">*</span></label
                    >
                    <input
                      class="small-text"
                      type="text"
                      placeholder="Location"
                      id="location"
                      name="location"
                    />
                  </div>
                  <div class="input-form">
                    <label for="link" class="bold-small-text"
                      >Meeting Link<span class="required">*</span></label
                    >
                    <input
                      class="small-text"
                      type="text"
                      placeholder="www.example-link.com"
                      id="link"
                      name="link"
                    />
                  </div>
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
      </div>
    </transition>
  </div>
</template>

<script>
import InboxComp from "@/components/meeting/InboxComp.vue";
import ResultComp from "@/components/meeting/ResultComp.vue";
import BaseDropZone from "@/components/UI/BaseDropZone.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { ref } from "vue";
import {
  formatDateTimeDetail,
  formatDateTimeHeader,
} from "@/helpers/formatDateTime";
import { formatBytes } from "@/helpers/formatFileSize";
export default {
  name: "ConfirmedView",
  components: { InboxComp, ResultComp, BaseDropZone, BaseButton, VueCal },
  setup() {
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
    return { dropzoneFile, drop, selectedFile, removeFile };
  },
  data() {
    return {
      selectedDate: "",
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
    };
  },
  computed: {
    filterByTitle() {
      return this.toBeConfirmedList.filter((toBeConfirmed) => {
        return toBeConfirmed.title
          .toLowerCase()
          .includes(this.searchInput.toLowerCase());
      });
    },
  },
  methods: {
    formatDateTime(dateTime) {
      return formatDateTimeDetail(dateTime);
    },
    formatDateTimeHeader(dateTime) {
      return formatDateTimeHeader(dateTime);
    },
    formatFileSize(byte, decimal) {
      return formatBytes(byte, decimal ? decimal : 2);
    },
    selectInbox(id) {
      this.selectedInbox = this.toBeConfirmedList.find((toBeConfirmed) => {
        this.selectedId = id;
        return toBeConfirmed.id == id;
      });
    },
    onClickShowSchedule(date, id) {
      this.acceptedArray = [];
      this.splitArray = [];
      this.isShowSchedule = true;
      this.selectedDate = date;
      let slotIndex = this.selectedInbox.slots.findIndex(
        (slot) => slot.id == id
      );
      var temp = [];
      var temp2 = [];
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
            id: this.selectedInbox.slots[slotIndex].responses[0].accepted[index]
              .executive_id,
            label:
              this.selectedInbox.slots[slotIndex].responses[0].accepted[index]
                .firstname +
              " " +
              this.selectedInbox.slots[slotIndex].responses[0].accepted[
                index
              ].lastname.substr(0, 1) +
              ".",
          });
        }
        if (
          this.selectedInbox.slots[slotIndex].responses[0].declined.length > 0
        ) {
          temp2.push({
            id: this.selectedInbox.slots[slotIndex].responses[0].declined[index]
              .executive_id,
            label:
              this.selectedInbox.slots[slotIndex].responses[0].declined[index]
                .firstname +
              " " +
              this.selectedInbox.slots[slotIndex].responses[0].declined[
                index
              ].lastname.substr(0, 1) +
              ".",
          });
        }
        if (
          this.selectedInbox.slots[slotIndex].responses[0].notResponse.length >
          0
        ) {
          temp2.push({
            id: this.selectedInbox.slots[slotIndex].responses[0].notResponse[
              index
            ].executive_id,
            label:
              this.selectedInbox.slots[slotIndex].responses[0].notResponse[
                index
              ].firstname +
              " " +
              this.selectedInbox.slots[slotIndex].responses[0].notResponse[
                index
              ].lastname.substr(0, 1) +
              ".",
          });
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
    },
    getDateObj(s, isTime = false) {
      var bits = s.split(/[- :]/);
      var date = new Date(bits[0], bits[1] - 1, bits[2]);
      date.setHours(bits[3], bits[4], 0);
      if (isTime == false) {
        return date;
      } else {
        return date.getHours() + ":" + date.getMinutes();
      }
    },
    getOverlaps(events) {
      events.sort((a, b) => {
        return this.getDateObj(a.start) - this.getDateObj(b.start);
      });
      var results = [];
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
      const keys = ["id"];
      const filteredData = results.filter(
        (value, index, self) =>
          self.findIndex((v) => keys.every((k) => v[k] === value[k])) === index
      );
      this.bestTimeSlot = filteredData;
      console.log(this.bestTimeSlot);
    },
    handleCreateMeeting() {},
  },
  mounted() {
    this.toBeConfirmedList = [
      {
        id: 1,
        title: "Discover what’s happened this week",
        create_at: "2022-05-15T07:40:32.000Z",
        duration_of_time: 3.5,
        slots: [
          {
            id: 1,
            date: "2022-08-25",
            responses: [
              {
                accepted: [
                  {
                    executive_id: 1,
                    title: "Mr",
                    firstname: "Similan",
                    lastname: "Klinsmith",
                    imageProfile: "",
                    periodOfTime: [
                      {
                        id: 109123,
                        split: 1, // split number must match the executuve_id
                        start: "2022-08-25 10:30",
                        end: "2022-08-25 11:30",
                      },
                      {
                        id: 109124,
                        split: 1, // split number must match the executuve_id
                        start: "2022-08-25 15:30",
                        end: "2022-08-25 17:30",
                      },
                    ],
                  },
                  {
                    executive_id: 2,
                    title: "Ms",
                    firstname: "Praepanwa",
                    lastname: "Tedprasit",
                    imageProfile: "",
                    periodOfTime: [
                      {
                        id: 109130,
                        split: 2, // split number must match the executuve_id
                        start: "2022-08-25 12:30",
                        end: "2022-08-25 14:30",
                      },
                      {
                        id: 109131,
                        split: 2, // split number must match the executuve_id
                        start: "2022-08-25 16:30",
                        end: "2022-08-25 18:30",
                      },
                    ],
                  },
                ],
                declined: [],
                notResponse: [],
              },
            ],
          },
          {
            id: 2,
            date: "2022-08-26",
            responses: [
              {
                accepted: [
                  {
                    executive_id: 1,
                    title: "Mr",
                    firstname: "Similan",
                    lastname: "Klinsmith",
                    imageProfile: "",
                    periodOfTime: [
                      {
                        id: 109125,
                        split: 1, // split number must match the executuve_id
                        start: "2022-08-26 10:30",
                        end: "2022-08-26 11:30",
                      },
                      {
                        id: 109126,
                        split: 1, // split number must match the executuve_id
                        start: "2022-08-26 15:30",
                        end: "2022-08-26 17:30",
                      },
                    ],
                  },
                ],
                declined: [
                  {
                    executive_id: 2,
                    title: "Ms",
                    firstname: "Praepanwa",
                    lastname: "Tedprasit",
                    imageProfile: "",
                  },
                ],
                notResponse: [],
              },
            ],
          },
        ],
      },
    ];
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.readonly {
  background-color: $grey !important;
}
.required {
  color: $error;
  margin-left: 0.2rem;
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  z-index: 12;
  width: 95% !important;
  height: 95%;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  column-gap: 2rem;
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
      height: 60rem;
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
    align-items: center;
    .form {
      width: 100%;
      overflow-y: scroll;
      .duration-container {
        display: flex;
        justify-content: flex-end;
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
      input:focus,
      textarea:focus {
        outline: none;
        border: 0.1rem solid $primaryViolet;
      }
      input::placeholder,
      textarea::placeholder {
        font-size: 1.4rem;
        color: $darkGrey;
      }
    }
  }
}
.result {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  height: 50rem;
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
    height: 100%;
    background-color: $white;
    border-radius: 2.5rem;
    padding: 5rem 4.4rem;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .sent-from {
      color: $darkGrey;
    }
    .button {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
