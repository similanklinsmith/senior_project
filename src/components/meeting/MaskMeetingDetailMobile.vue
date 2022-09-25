<template>
  <div class="meeting-view-detail">
    <div class="line" />
    <div class="back-button" @click="$router.go(-1)">
      <i class="fa-solid fa-arrow-left icon"></i><div class="remark-text">Back</div>
    </div>
    <div class="line" />
    <div class="view-detail" :style="type == 'sent' ? { height: '100vh' } : {}">
      <div class="title remark-text">
        {{ title }} 
      </div>
      <div class="date-time">
        {{ dateTimeDesc }}
      </div>
      <slot name="detail-slot"></slot>
    </div>
  </div>
</template>

<script>
import { formatDateTimeDetail } from "@/helpers/formatDateTime";
export default {
  name: "MaskMeetingDetailMobile",
  props: ["title", "dateTime", "type", "sender"],
  methods: {
  },
  computed: {
    formatDateTime(dateTime) {
      return formatDateTimeDetail(dateTime);
    },
    dateTimeDesc() {
      switch (this.type) {
        case "inbox":
          return `sent on ${formatDateTimeDetail(this.dateTime)} by ${this.sender}`;
        case "sent":
          return `created poll on ${formatDateTimeDetail(this.dateTime)}`;
        case "toBeConfirmed":
          return `sent on ${formatDateTimeDetail(this.dateTime)} by ${this.sender}`;
        case "results":
          return `completed on ${formatDateTimeDetail(this.dateTime)}`;
        case "replied":
          return `sent on ${formatDateTimeDetail(this.dateTime)} by ${this.sender}`;
        default:
          return "Something went wrong :(";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
@media (min-width: 27em) {.meeting-view-detail{height:100% !important;} .date-time{font-size: 1.6rem !important;} .title.remark-text{font-size: 2.2rem !important;}.back-button {&:hover{color: $primaryViolet;} width: fit-content; transition: 0.2s all ease-in-out; cursor: pointer;.icon {font-size: 2rem !important;}.remark-text{display: block !important;}}}
.meeting-view-detail {background-color: $white;height: 100%;width: 100%;display: flex;flex-direction: column;padding: 1.6rem 0;.back-button {display:flex;align-items: center;column-gap: 1rem;padding: 3.2rem;.remark-text{display: none;}.icon {font-size: 2.8rem;}}.line {width: 100%;height: 0.1rem;background-color: $darkGrey;}.view-detail {height:100vh; display: flex;flex-direction: column;row-gap: 1rem;padding: 3.6rem 3.2rem;.title.remark-text {color: $darkViolet;line-height: 1.4;}.date-time {color: $darkGrey;font-size: 1.8rem;line-height: 1.6;}}}
</style>
