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
            :time="inbox.time"
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
          created poll at 11:30 AM 04 Apr 2022
        </div>
        <div class="result">
          <ResultComp
            v-for="res in response.responses"
            :key="res.id"
            :response="res"
            @showSchedule="onClickShowSchedule"
          />
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
                    :time-from="7 * 60"
                    :time-step="30"
                    active-view="day"
                    :events="events"
                    :split-days="splitDays"
                    :sticky-split-labels="stickySplitLabels"
                    hide-view-selector
                  >
                  </vue-cal>
                </div>
              </div>
              <div class="second-col">
                <form action="">
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
                        class="small-text"
                        type="date"
                        placeholder="date"
                        id="date"
                        name="date"
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
                  <BaseDropZone @drop.prevent="drop" @change="selectedFile" />
                  <div class="file-info bold-small-text">
                    File: {{ dropzoneFile.name }}
                  </div>
                  <div class="button">
                    <BaseButton
                      buttonType="common-button"
                      btnText="Create meeting"
                      textColor="white"
                      textHover="white"
                      color="#7452FF"
                      hoverColor="#23106D"
                      width="fit-content"
                    >
                    </BaseButton>
                  </div>
                </form>
              </div>
            </div>
          </teleport>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import InboxComp from "../../../components/meeting/InboxComp.vue";
import ResultComp from "../../../components/meeting/ResultComp.vue";
import BaseDropZone from "../../../components/UI/BaseDropZone.vue";
import BaseButton from "../../../components/UI/BaseButton.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { ref } from "vue";
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
    };
    return { dropzoneFile, drop, selectedFile };
  },
  data() {
    return {
      selectedDate: "",
      searchInput: "",
      toBeConfirmedList: [],
      selectedInbox: null,
      selectedId: null,
      response: null,
      isShowSchedule: false,
      stickySplitLabels: false,
      bestTimeSlot: [],
      eventsArray: [
        {
          id: 1,
          start: this.getDateObj("2022-04-06 10:30"),
          end: this.getDateObj("2022-04-06 11:30"),
          title: "10:30 - 11:30",
          content: "Free Time 10:35 - 11:30",
          class: "health",
          split: 1, // Has to match the id of the split you have set (or integers if none).
        },
        {
          id: 5,
          start: this.getDateObj("2022-04-06 14:35"),
          end: this.getDateObj("2022-04-06 16:30"),
          title: "14:35 - 16:30",
          content: "Free Time 14:35 - 16:30",
          class: "health",
          split: 5, // Has to match the id of the split you have set (or integers if none).
        },
        {
          id: 3,
          start: this.getDateObj("2022-04-06 10:35"),
          end: this.getDateObj("2022-04-06 11:30"),
          title: "10:35 - 11:30",
          content: "Free Time 10:35 - 11:30",
          class: "health",
          split: 4, // Has to match the id of the split you have set (or integers if none).
        },
        {
          id: 4,
          start: this.getDateObj("2022-04-06 10:35"),
          end: this.getDateObj("2022-04-06 11:30"),
          title: "10:35 - 11:30",
          content: "Free Time 10:35 - 11:30",
          class: "health",
          split: 3, // Has to match the id of the split you have set (or integers if none).
        },
        {
          id: 5,
          start: this.getDateObj("2022-04-06 11:00"),
          end: this.getDateObj("2022-04-06 13:15"),
          title: "11:00 - 13:15",
          content: '<i class="v-icon material-icons">local_hospital</i>',
          class: "health",
          split: 2,
        },
        {
          id: 6,
          start: this.getDateObj("2022-04-06 18:30"),
          end: this.getDateObj("2022-04-06 20:30"),
          title: "18:30 - 20:30",
          content: '<i class="v-icon material-icons">fitness_center</i>',
          class: "sport",
          split: 1,
        },
      ],
      splitDays: [
        { id: 1, class: "mom", label: "Similan, K." },
        { id: 2, class: "dad", label: "Noparat, P." },
        { id: 3, class: "kid1", label: "John, S." },
        { id: 4, class: "kid2", label: "Alexanda, Q." },
        { id: 5, class: "kid3", label: "Michaele, A." },
      ],
      events: [
        {
          start: "2022-04-06 10:30",
          end: "2022-04-06 11:30",
          title: "Doctor appointment",
          content: "Free Time 10:30 - 11:30",
          class: "health",
          split: 1, // Has to match the id of the split you have set (or integers if none).
        },
        {
          start: "2022-04-06 14:35",
          end: "2022-04-06 16:30",
          title: "Doctor appointment",
          content: "Free Time 14:35 - 16:30",
          class: "health",
          split: 5, // Has to match the id of the split you have set (or integers if none).
        },
        {
          start: "2022-04-06 10:35",
          end: "2022-04-06 11:30",
          title: "Doctor appointment",
          content: "Free Time 10:35 - 11:30",
          class: "health",
          split: 4, // Has to match the id of the split you have set (or integers if none).
        },
        {
          start: "2022-04-06 10:35",
          end: "2022-04-06 11:30",
          title: "Doctor appointment",
          content: "Free Time 10:35 - 11:30",
          class: "health",
          split: 3, // Has to match the id of the split you have set (or integers if none).
        },
        {
          start: "2022-04-06 11:00",
          end: "2022-04-06 13:15",
          title: "Dentist appointment",
          content: '<i class="v-icon material-icons">local_hospital</i>',
          class: "health",
          split: 2,
        },
        {
          start: "2022-04-06 18:30",
          end: "2022-04-06 20:30",
          title: "Crossfit",
          content: '<i class="v-icon material-icons">fitness_center</i>',
          class: "sport",
          split: 1,
        },
      ],
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
    selectInbox(id) {
      this.selectedInbox = this.toBeConfirmedList.find((toBeConfirmed) => {
        this.selectedId = id;
        return toBeConfirmed.id == id;
      });
    },
    onClickShowSchedule(date) {
      this.isShowSchedule = true;
      this.selectedDate = date;
      this.getOverlaps(this.eventsArray);
    },
    onClickCloseSchedule() {
      this.isShowSchedule = false;
    },
    getDateObj(s) {
      var bits = s.split(/[- :]/);
      var date = new Date(bits[0], bits[1] - 1, bits[2]);
      date.setHours(bits[3], bits[4], 0);
      return date;
    },
    getOverlaps(events) {
      events.sort(function (a, b) {
        return a.start - b.start;
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
            id: oEvent.title,
            eventCount: nOverlaps,
            toString: function () {
              return "[id:" + this.title + ", events:" + this.eventCount + "]";
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
    },
  },
  mounted() {
    this.toBeConfirmedList = [
      {
        id: 1,
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "2022-05-15T07:40:32.000Z",
      },
      {
        id: 2,
        title: "Let's have meeting",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "2022-05-15T07:40:32.000Z",
      },
      {
        id: 3,
        title: "Whatcha doin today everyone?",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "2022-05-15T07:40:32.000Z",
      },
      {
        id: 4,
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "2022-05-15T07:40:32.000Z",
      },
      {
        id: 5,
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "2022-05-15T07:40:32.000Z",
      },
      {
        id: 6,
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "2022-05-15T07:40:32.000Z",
      },
    ];
    this.response = {
      id: 1,
      title: "Discover what’s happened this week",
      dateTime: "11:30 AM 04 Apr 2022",
      responses: [
        {
          id: 1,
          dateTime: "Wednesday, April 06, 2022",
          accepted: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
            {
              id: 3,
              title: "Ms",
              firstname: "Noparat",
              lastname: "Prasongdee",
              imageProfile: "",
            },
            {
              id: 4,
              title: "Mr",
              firstname: "John",
              lastname: "Smith",
              imageProfile: "",
            },
          ],
          declined: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
            {
              id: 3,
              title: "Ms",
              firstname: "Noparat",
              lastname: "Prasongdee",
              imageProfile: "",
            },
            {
              id: 4,
              title: "Mr",
              firstname: "John",
              lastname: "Smith",
              imageProfile: "",
            },
          ],
          notResponse: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
          ],
        },
        {
          id: 2,
          dateTime: "Thursday, April 04, 2022",
          accepted: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
            {
              id: 3,
              title: "Ms",
              firstname: "Noparat",
              lastname: "Prasongdee",
              imageProfile: "",
            },
            {
              id: 4,
              title: "Mr",
              firstname: "John",
              lastname: "Smith",
              imageProfile: "",
            },
          ],
          declined: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
            {
              id: 3,
              title: "Ms",
              firstname: "Noparat",
              lastname: "Prasongdee",
              imageProfile: "",
            },
            {
              id: 4,
              title: "Mr",
              firstname: "John",
              lastname: "Smith",
              imageProfile: "",
            },
          ],
          notResponse: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
            {
              id: 3,
              title: "Ms",
              firstname: "Noparat",
              lastname: "Prasongdee",
              imageProfile: "",
            },
            {
              id: 4,
              title: "Mr",
              firstname: "John",
              lastname: "Smith",
              imageProfile: "",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/colors/webColors.scss";
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
  width: 95%;
  height: 90%;
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
    height: 100%;
    background-color: $white;
    border-radius: 2.5rem;
    padding: 3.6rem 3.2rem;
    overflow: scroll;
    .file-info {
      margin: 1rem 0rem;
    }
    .button {
      display: flex;
      justify-content: flex-end;
      width: 100%;
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
  row-gap: 1rem;
  height: 50rem;
  overflow: scroll;
  margin: 1rem 0;
  padding: 0 1rem;
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
      height: 66rem;
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
