<template>
  <div class="calendar-screen">
    <BaseHeader
      :headerText="text['calendar']['header']"
      :contentText="text['calendar']['subHeader']"
    >
      <BaseButton
        buttonType="common-button"
        :btnText="text['calendar']['createMeeting']"
        textColor="#23106D"
        textHover="white"
        color="#DBD2FF"
        hoverColor="#23106D"
        @onClick="$router.push({ path: '/meetings-management' })"
      >
      </BaseButton>
    </BaseHeader>
    <div class="body">
      <div class="first-body-section grid">
        <div class="first-col">
          <div class="card">
            <vue-cal
              class="vuecal--date-picker vuecal--violet-theme"
              hide-view-selector
              xsmall
              :time="false"
              active-view="month"
              :disable-views="['week', 'day']"
              @cell-focus="selectedDate = $event"
              :selected-date="selectedDate"
              :events="getEvents"
              :on-event-click="onEventClick"
            >
            </vue-cal>
          </div>
          <div class="filter-executive">
            <div class="remark-text label">{{ text['calendar']['label'] }}</div>
            <div class="search-filter">
              <div class="input-icon">
                <i class="icon fa-solid fa-magnifying-glass"></i>
                <input
                  id="search-input-cal"
                  class="small-text"
                  type="text"
                  :placeholder="text['calendar']['placeholder']"
                  @focus="onFocus"
                  @blur="onBlur"
                  v-model="searchInput"
                />
              </div>
            </div>
            <div
              class="list-executive-card"
              :style="
                filterByName.length >= 5
                  ? { overflowY: 'scroll' }
                  : { overflow: 'hidden' }
              "
            >
              <transition-group name="route" v-if="!getterLoadingStatus">
                <ExecutiveComp
                  v-for="(executive, index) in filterByName"
                  :key="index"
                  @selectExecutive="selectExecutive"
                  :id="executive.id"
                  :title="formatTitle(executive.title_code)"
                  :firstname="executive.first_name"
                  :lastname="executive.last_name"
                  :image="executive.img_profile"
                  :selectedId="selectedId"
                />
                <div
                  v-if="filterByName.length == 0"
                  class="remark-text not-found"
                >
                  {{ text['calendar']['notFound'] }}
                </div>
              </transition-group>
              <div
                v-if="getterLoadingStatus"
                class="remark-text not-found loading"
              >
                {{ text['calendar']['loading'] }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="selected-executives">
            <div class="bold-content-text">{{ text['calendar']['filter'] }}</div>
            <div
              class="selected-executive bold-small-text"
              v-if="selectedExecutive"
            >
              {{ formatTitle(selectedExecutive.title_code) }}
              {{ selectedExecutive.first_name }}
              {{ selectedExecutive.last_name }}
              <span @click="(selectedId = null), (selectedExecutive = null)"
                ><i class="icon fa-solid fa-xmark"></i
              ></span>
            </div>
          </div>
          <div class="calendar-show">
            <vue-cal
              class="vuecal--date-picker vuecal--violet-theme"
              hide-view-selector
              active-view="month"
              :disable-views="['week']"
              :selected-date="selectedDate"
              @cell-focus="selectedDate = $event"
              :events="getEvents"
              :on-event-click="onEventClick"
            >
            </vue-cal>
          </div>
        </div>
      </div>
    </div>
    <BaseExecutivesPopup
      :executives="getExecutivesList"
      :selectedId="selectedId"
      v-if="isSearchMobile"
      @onClickCloseSearch="isSearchMobile = false"
      @onClickSelectExecutive="selectExecutive"
    />
    <div class="mobile-button-actions" v-if="getExecutivesList.length != 0">
      <div class="mobile-button-search" @click="isSearchMobile = true">
        <div class="number-of-executive">
          <div class="bold-small-text">{{ getExecutivesList.length }}</div>
        </div>
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
    </div>
    <teleport to="#portal-target">
      <div class="modal" @click="isShow = false, selectedEvent = null" v-if="isShow = true && selectedEvent != null">
        <div class="pop-up">
          <div class="header-pop-up remark-text">{{ selectedEvent.title }}</div>
          <div class="date content-text">
            <i class="icon fa-regular fa-calendar"></i>{{ selectedEvent.start.format('DD-MM-YYYY') }}
          </div>
          <div class="time content-text">
            <i class="icon fa-regular fa-clock"></i>{{ selectedEvent.start.split(" ")[1] }} - {{ selectedEvent.end.split(" ")[1] }}
          </div>
          <div class="line" />
          <div class="meeting-detail small-text">
            {{ selectedEvent.content }}
          </div>
          <BaseButton
            buttonType="common-button"
            btnText="Close"
            textColor="white"
            textHover="white"
            color="#F33C3C"
            hoverColor="#d93333"
            @onClick="isShow = false, selectedEvent = null"
            >
          </BaseButton>
        </div>
      </div>
  </teleport>
  </div>
</template>

<script>
/* eslint-disable */
import BaseHeader from "@/components/UI/BaseHeader.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import ExecutiveComp from "@/components/meeting/ExecutiveComp.vue";
import BaseExecutivesPopup from "@/components/UI/BaseExecutivesPopup.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CalendarView",
  components: {
    BaseHeader,
    BaseButton,
    VueCal,
    ExecutiveComp,
    BaseExecutivesPopup,
  },
  data() {
    return {
      text: null,
      lang: null,
      selectedDate: "",
      searchInput: "",
      selectedExecutive: null,
      selectedId: null,
      isSearchMobile: false,
      isShow: false,
      selectedEvent: null
    };
  },
  computed: {
    ...mapGetters([
      "getterMyExecutives",
      "getterLoadingStatus",
      "getterExecutiveTitles",
      "getterAllMeetings",
    ]),
    getExecutivesList() {
      return this.$store.getters.getterMyExecutives;
    },
    filterByName() {
      return this.getExecutivesList.filter((executive) => {
        return (
          executive.first_name
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          executive.last_name
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
        );
      });
    },
    getEvents() {let events = [];if (this.selectedId) {for (let index = 0;index < this.$store.getters.getterAllMeetings.length;index++) {if (this.$store.getters.getterAllMeetings[index].attendees.includes(this.selectedId)) {var e = new Date(this.$store.getters.getterAllMeetings[index].start),t = new Date(e),n = 10 > t.getMinutes() ? "0" + t.getMinutes() : t.getMinutes(),s = new Date(this.$store.getters.getterAllMeetings[index].end),i = new Date(s),g = 10 > i.getMinutes() ? "0" + i.getMinutes() : i.getMinutes();events.push({start:this.$store.getters.getterAllMeetings[index].start.split("T")[0] +" " +t.getUTCHours() +":" +n,end:this.$store.getters.getterAllMeetings[index].end.split("T")[0] +" " +i.getUTCHours() +":" +g,title: this.$store.getters.getterAllMeetings[index].title,content:this.$store.getters.getterAllMeetings[index].meeting_detail,});}}} else {for (let index = 0;index < this.$store.getters.getterAllMeetings.length;index++) {var e = new Date(this.$store.getters.getterAllMeetings[index].start),t = new Date(e),n = 10 > t.getMinutes() ? "0" + t.getMinutes() : t.getMinutes(),s = new Date(this.$store.getters.getterAllMeetings[index].end),i = new Date(s),g = 10 > i.getMinutes() ? "0" + i.getMinutes() : i.getMinutes();events.push({start:this.$store.getters.getterAllMeetings[index].start.split("T")[0] +" " +t.getUTCHours() +":" +n,end:this.$store.getters.getterAllMeetings[index].end.split("T")[0] +" " +i.getUTCHours() +":" +g,title: this.$store.getters.getterAllMeetings[index].title,content:this.$store.getters.getterAllMeetings[index].meeting_detail,});}}return events;},
    },
  methods: {
    ...mapActions(["getMyExecutives", "getExecutiveTitle", "getAllMeetings"]),
    onEventClick(event, e) {this.isShow = true, this.selectedEvent = event, e.stopPropagation()},
    onFocus() {
      document.getElementById("search-input-cal").placeholder = this.text['calendar']['focusSearch'];
    },
    onBlur() {
      document.getElementById("search-input-cal").placeholder = this.text['calendar']['placeholder'];
    },
    formatTitle(str) {
      return this.getterExecutiveTitles[str];
    },
    selectExecutive(id) {
      if (this.selectedId == id) {
        this.selectedId = null;
      } else {
        this.selectedExecutive = this.getExecutivesList.find((executive) => {
          this.selectedId = id;
          return executive.id == id;
        });
      }
      window.scrollTo(0, 0);
    },
  },
  created() {
    this.getMyExecutives();
    this.getExecutiveTitle();
    this.getAllMeetings();
  },
  mounted() {
    window.scrollTo(0, 0);
    this.selectedDate = new Date().toISOString().slice(0, 10);
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
.meeting-detail::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1rem;}
.meeting-detail::-webkit-scrollbar-track {margin: 0 1rem;border-radius: 0.5rem;}
.meeting-detail::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}
.meeting-detail::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}
.pop-up {.meeting-detail{margin-bottom: 1.8rem;height: 12rem;overflow-y: scroll;}.line {width: 100% !important;margin: 1.5rem 0;height: 0.1rem;background-color: $grey;}top: 50%;left: 50%;transform: translate(-50%, -50%);position: fixed;z-index: 12;border-radius: 2.5rem;display: flex;row-gap:1rem;flex-direction: column;background-color: $white;width: 64rem;padding: 2.8rem 2.2rem;animation-name: appears;animation-duration: 0.5s;animation-iteration-count: 1;.date,.time {color: $primaryViolet;.icon {margin-right: 1rem;}}}
.modal {.sending{color:$yellow}width: 100%;height: 100vh;position: fixed;background-color: rgba(24, 24, 26, 0.4);z-index: 11;display: flex;flex-direction: column;align-items: center;justify-content: center;}
.selected-executives {background-color: $white;padding: 1.6rem 2rem;border-radius: 1rem;display: flex;align-items: center;column-gap: 1rem;margin-bottom: 1rem;.selected-executive {width: fit-content;height: 3rem;background-color: $fadedViolet;padding: 1rem;border-radius: 1rem;display: flex;align-items: center;color: $primaryViolet;transition: 0.3s all ease-in-out;column-gap: 0.6rem;.icon {color: $white;background-color: $error;border-radius: 50%;height: 1.2rem;width: 1.2rem;padding: 0.2rem;}cursor: pointer;&:hover {background-color: $primaryGrey;color: $darkGrey;}}}
.calendar-screen {.body {padding: 3rem;.first-body-section {grid-template-columns: 1fr 2fr;column-gap: 3rem;animation-name: appearsBottom;animation-duration: 0.75s;animation-iteration-count: 1;.first-col {display: flex;flex-direction: column;.card {overflow: hidden;position: relative;height: 32rem;width: 100%;background-color: $white;border-radius: 2.5rem;}.filter-executive {width: 100%;height: 54rem;display: flex;flex-direction: column;row-gap: 1rem;position: relative;margin-top: 3rem;.label {color: var(--outsideText);}.search-filter {position: relative;width: 100%;display: flex;align-items: center;justify-items: center;.input-icon {width: 100%;display: flex;align-items: center;justify-items: center;input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $white;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}.icon {position: absolute;right: 0;font-size: 1.4rem;margin-right: 1rem;color: $darkGrey;}}}.list-executive-card::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1.4rem;}.list-executive-card::-webkit-scrollbar-track {margin: 1rem;border-radius: 0.5rem;}.list-executive-card::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}.list-executive-card::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}.list-executive-card {width: 100%;height: 100%;border-radius: 1.5rem;background-color: $white;overflow: hidden;.not-found {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 100%;text-align: center;color: $darkGrey;}.loading {animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}}}}.calendar-show {overflow: hidden;position: relative;height: 82rem;width: 100%;background-color: $white;border-radius: 2.5rem;}}}}
.mobile-button-actions {display: none;right: 0%;bottom: 0%;}.mobile-button-search {justify-content: center;align-items: center;color: $white;font-size: 2rem;width: 6.4rem;height: 6.4rem;border-radius: 1rem;background-color: $darkViolet;box-shadow: 1.8rem 1.8rem 1.3rem 0 #ababab4d;transform: translateX(-5rem) translateY(-5rem);position: relative;.number-of-executive {transform: translateX(1rem) translateY(-1rem);position: absolute;top: 0%;right: 0%;background-color: $error;width: 2.4rem;height: 2.4rem;border-radius: 50%;display: flex;align-items: center;justify-content: center;outline: 0.4rem solid $white;}}.mobile-button-search:active {animation: press 0.2s 1 linear;}.search-mobile-button {display: none;}
@media (max-width: 26.75em) {.search-mobile-button {display: block;}.mobile-button-actions {position: fixed;display: flex;flex-direction: column;row-gap: 2rem;}.mobile-button-search {display: flex;}.calendar-screen {.body {.first-body-section {grid-template-columns: 1fr;grid-auto-flow: dense;column-gap: 3rem;.calendar-show {height: 100rem;}.first-col {display: none;}}}}}
</style>
