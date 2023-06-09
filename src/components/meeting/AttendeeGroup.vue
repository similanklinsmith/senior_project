<template>
  <div class="meeting">
    <div class="mobile-meeting-card" @click="btnAction">
      <div class="first-section">
        <div class="remark-text">{{ title }}</div>
        <div class="date-time">
          <div class="time">
            <i class="icon fa-regular fa-clock"></i
            >{{ formatDateTime(startTime, true) }} -
            {{ formatDateTime(endTime, true) }}
          </div>
          <div class="date">
            <i class="icon fa-regular fa-calendar"></i>{{ formatDate(date, lang) }}
          </div>
        </div>
        <div class="attendees">
          <div
            class="attendee"
            v-for="(attendee, index) in attendees.slice(0, 4)"
            :key="index"
          >
            <div
              class="profile-image"
              v-if="attendee.img_profile == 'default_profile.png'"
            >
              <img
                src="@/assets/decorations/sample_profile.png"
                alt="sample profile illustration"
              />
            </div>
            <div class="real-profile-image" v-else>
              <img
                :src="urlImage + '/' + attendee.img_profile"
                alt="sample profile illustration"
                @error="
                  $event.target.src =
                    'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
                "
              />
            </div>
          </div>
          <div class="attendee-more" v-if="attendees.length - 4 > 0">
            <div class="remark-text">+{{ attendees.length - 4 }}</div>
          </div>
        </div>
      </div>
      <div class="second-section">
        <div class="location common-text">
          <i class="icon fa-solid fa-location-dot"></i
          ><span>{{ location }}</span>
        </div>
        <div class="attachments">
          <div class="file" v-if="file">
            <i class="icon fa-regular fa-file"></i>
          </div>
          <div class="link" v-if="link">
            <i class="icon fa-solid fa-link"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="meeting-card">
      <div class="display-day flex-col-center">
        <div class="month content-text">{{ formatDay(date) }}</div>
        <div class="date header-text">{{ formatDay(date, true)}}</div>
      </div>
      <div class="time flex-col-center">
        <div class="common-text">{{ text["home"]["start-end"] }}</div>
        <div class="content-text">
          <i class="icon fa-regular fa-clock"></i
          >{{ formatDateTime(startTime, true) }} -
          {{ formatDateTime(endTime, true) }}
        </div>
      </div>
      <div class="line" />
      <div class="meeting-detail">
        <div class="bold-content-text">{{ title }}</div>
        <div class="additional-detail">
          <div class="small-text" v-if="file">
            <i class="icon fa-regular fa-file"></i
            ><span class="attached-file">{{ text["home"]["file"] }}</span>
          </div>
          <div class="small-text" v-if="link">
            <i class="icon fa-solid fa-link"></i
            ><span class="attached-link">{{ text["home"]["link"] }}</span>
          </div>
          <div class="attendees">
            <i class="icon fa-regular fa-user"></i>
            <div class="attendee-img">
              <div
                v-for="(attendee, index) in attendees.slice(0, 4)"
                :key="index"
                class="attendee"
                :style="'background-color:' + colorsList[index] + ';'"
              >
                <div class="small-content" style="color: white">N</div>
              </div>
              <div
                v-if="attendees.length - 4 > 0"
                class="attendee"
                :style="'background-color:' + colorsList[4] + ';'"
              >
                <div class="small-content" style="color: white">
                  +{{ attendees.length - 4 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btnAction" @click="btnAction">
      <div class="small-text">
        {{ text["home"]["showDetail"]
        }}<i class="icon fa-solid fa-circle-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import {
  formatDateTimeDetail,
  formatDateTimeHeader
} from "@/helpers/formatDateTime";
export default {
  name: "AttendeeGroup",
  props: [
    "id",
    "title",
    "startTime",
    "endTime",
    "date",
    "attendees",
    "location",
    "file",
    "link",
  ],
  data() {
    return {
      text: null,
      lang: null,
      urlImage: this.$store.state.imageURL,
      colorsList: ["#23106D", "#7452FF", "#DBD2FF", "#F4F4F4", "#23106D"],
    };
  },
  methods: {
    btnAction() {
      this.$emit('handleClick', this.id)
      this.$router.push({ path: `/meetings-inbox/inbox/${this.id}`, });
    },
    formatDay(date, isDate = false) {
      const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
      const monthNamesTH = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน","กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
      var r = new Date(date.split("T")[0]);
      if (isDate == true) {
        return r.getDate();
      }
      if (this.lang == 'th') {
        return monthNamesTH[r.getMonth()];
      } else {
        return monthNames[r.getMonth()];
      }
    },
    formatDateTime(dateTime, isTime) {
      return formatDateTimeDetail(dateTime, isTime);
    },
    formatDate(date, lang) {
      return formatDateTimeHeader(date, lang);
    }
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
.meeting {display: flex;width: 100%;padding: 2.4rem 3.2rem;border-radius: 2rem;background-color: $white;justify-content: space-between;align-items: center;margin-bottom: 2rem;position: relative;}
.mobile-meeting-card {display: none;}
.btnAction {cursor: pointer;color: $yellow;transition: 0.2s all ease-in-out;.icon {font-size: 1.8rem;margin-left: 1rem;transition: 0.2s all ease-in-out;}}
.btnAction:hover {color: $primaryViolet;.icon {color: $primaryViolet;}}
.meeting-card {display: flex;width: 80%;.display-day {width: 9.6rem;padding: 1.8rem;border-radius: 1.5rem;background-color: $primaryViolet;color: $white;row-gap: 0.4rem;margin-right: 1.5rem;}.time {margin-left: 1.5rem;row-gap: 1.6rem;align-items: start !important;.common-text {color: $darkViolet;}.content-text {color: $primaryViolet;.icon {font-size: 1.4rem;margin-right: 1rem;}}}.line {margin: 0 5rem;height: auto;width: 0.1rem;background-color: $grey;}.meeting-detail {display: flex;flex-direction: column;justify-content: center;.bold-content-text {margin-bottom: 2rem;}.additional-detail {display: flex;color: $darkViolet;align-items: center;column-gap: 5rem;.icon {margin-right: 1rem;color: $primaryViolet;}.attendees {display: flex;align-items: center;.icon {font-size: 1.4rem;margin-right: 1rem;color: $primaryViolet;}.attendee-img {display: flex;padding-top: 0.2rem;padding-bottom: 0.2rem;padding-left: 0.4rem;border-radius: 5rem;background-color: $fadedViolet;.attendee {width: 2.4rem;height: 2.4rem;border-radius: 50%;background-color: $primaryViolet;margin-right: -0.8rem;display: flex;justify-content: center;align-items: center;}}}}}}
@media (max-width: 63.5em) {.meeting {padding: 1.4rem 2.2rem;margin-bottom: 1.8rem;}.meeting-card {.time {margin-left: 0rem;}.line {margin: 0 3rem;}.meeting-detail {.additional-detail {column-gap: 1.5rem;.icon {margin-right: 0.6rem;}}}}}
@media (max-width: 48em) {.meeting-card {width: 85%;.line {margin: 0 2rem;}}}
@media (max-width: 40rem) {.meeting-card {.meeting-detail {.additional-detail {.attached-file,.attached-link {display: none;}}}}}
@media (max-width: 26.75em) {.meeting {box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;}.mobile-meeting-card {display: flex;flex-direction: column;width: 100%;.first-section {padding: 4rem 4.6rem;display: flex;flex-direction: column;width: 100%;height: 100%;row-gap: 2.8rem;border-bottom: 1px solid $darkGrey;.date-time {display: flex;column-gap: 3.2rem;color: $primaryViolet;.date,.time {font-size: 2rem;.icon {margin-right: 1rem;}}}.attendees {display: flex;column-gap: 2rem;.attendee {width: 6.4rem;height: 6.4rem;border-radius: 0.5rem;background-color: $fadedViolet;.real-profile-image {border-radius: 1rem;width: 6.4rem;height: 6.4rem;overflow: hidden;img {height: 100%;width: 100%;object-fit: cover;}}.profile-image {border-radius: 1rem;width: 6.4rem;height: 6.4rem;background-color: $fadedViolet;padding: 0.8rem;img {width: 100%;height: 100%;}}}.attendee-more {width: 6.4rem;height: 6.4rem;border-radius: 0.5rem;background-color: $grey;display: flex;justify-content: center;align-items: center;.remark-text {color: $primaryViolet;}}}}.second-section {padding: 3.6rem 4.6rem;display: flex;justify-content: space-between;align-items: center;.location {color: $primaryViolet;.icon {margin-right: 1rem;font-size: 2rem;}span {color: $highlightViolet;}}.attachments {display: flex;column-gap: 4rem;.file,.link {font-size: 2rem;background-color: $yellow;padding: 2rem;border-radius: 50%;position: relative;display: flex;justify-content: center;align-items: center;.icon {position: absolute;color: $white;}}}}}.meeting {padding: 0;overflow: hidden;margin-bottom: 2.8rem;}.meeting-card {display: none;}.btnAction {display: none;}}
@media (max-width: 21.75em) {.mobile-meeting-card {.first-section {padding: 4rem 3.6rem;}.second-section {padding: 3.6rem 3.6rem;}}}
</style>
