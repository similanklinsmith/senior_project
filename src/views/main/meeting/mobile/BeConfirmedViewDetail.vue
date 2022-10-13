<template>
  <div v-if="!isLoading && inboxDetail != null">
    <MaskMeetingDetailMobile
      :title="inboxDetail.title"
      :dateTime="inboxDetail.create_at"
      :type="type"
      :sender="inboxDetail.secretary.name"
    >
      <template v-slot:detail-slot>
        <div class="expired-date">
          <span>*</span>{{ text["toBeConfirmed"]["dueDate"] }}
          {{ inboxDetail.due_date_time.split("T")[0] }}
          <span v-if="new Date(inboxDetail.due_date_time) >= new Date()"
            >({{ calculateRemainingDay(inboxDetail.due_date_time) }} {{text["toBeConfirmed"]["postDueDate"]}}
            )</span
          >
          <span v-else>({{text["toBeConfirmed"]["alreadyExpired"]}})</span>
        </div>
        <div
          class="response"
          :class="`${
            new Date(inboxDetail.due_date_time) < new Date() ? 'expired' : ''
          }`"
        >
          <div
            class="response-container"
            v-for="(periodOfTime, index) in inboxDetail.periodOfTime"
            :key="index"
          >
            <div class="day remark-text">
              {{ formatDateTimeHeader(periodOfTime.date, lang) }}
            </div>
            <ResponseComp
              @onResponse="handleResponse"
              v-for="executive in periodOfTime.executives"
              :key="executive.executive_id"
              :executive="executive"
              :date="periodOfTime.date"
              :duration="inboxDetail.duration_of_time"
              :dateTimeHeader="formatDateTimeHeader(periodOfTime.date, lang)"
            />
          </div>
        </div>
        <BaseButton
          v-if="responseAll"
          buttonType="common-button"
          :btnText="text['toBeConfirmed']['confirm']"
          textColor="white"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          width="100%"
          @onClick="confirmResponse"
        >
        </BaseButton>
      </template>
    </MaskMeetingDetailMobile>
  </div>
  <BaseNotFound v-else :isFailed="isFailed" />
</template>

<script>
import MaskMeetingDetailMobile from "@/components/meeting/MaskMeetingDetailMobile.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseNotFound from "@/components/UI/BaseNotFound.vue";
import ResponseComp from "@/components/meeting/ResponseComp.vue";
import { mapGetters, mapActions } from "vuex";
import { useRoute } from "vue-router";
import { formatDateTimeHeader } from "@/helpers/formatDateTime";
export default {
  name: "BeConfirmedViewDetail",
  components: {
    MaskMeetingDetailMobile,
    ResponseComp,
    BaseButton,
    BaseNotFound,
  },
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const type = route.params.type;
    return { id, type };
  },
  data() {
    return {
      text: null,
      lang: null,
      isFailed: false,
      isLoading: false,
      inboxDetail: null,
      dataToBe: {},
      response: [],
    };
  },
  computed: {
    ...mapGetters(["getterMyBeConfirmedDetail"]),
    responseAll() {
      var isValid = false;
      if (
        this.response.length > 0 &&
        this.response.length ==
          this.inboxDetail.periodOfTime[0].executives.length
      ) {
        for (let index = 0; index < this.response.length; index++) {
          isValid =
            this.response[index].timeSlot.length ==
            this.inboxDetail.periodOfTime.length;
          if (isValid == false) {
            return false;
          }
          for (let i = 0; i < this.response[index].timeSlot.length; i++) {
            if (this.response[index].timeSlot[i].status == "accepted") {
              isValid =
                this.response[index].timeSlot[i].preferredTime.length != 0;
              if (isValid == false) {
                return isValid;
              }
            }
          }
        }
        return isValid;
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["getMyBeConfirmedDetail"]),
    async getBeConfirmedDetail() {
        this.isLoading = true;
        this.inboxDetail = await this.$store.dispatch(
          "getMyBeConfirmedDetail",
          this.id
        );
        this.inboxDetail == null ? this.isFailed = true : this.isFailed = false;
        this.isLoading = false;
    },
    formatDateTimeHeader(dateTime, lang) {
      return formatDateTimeHeader(dateTime, lang);
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
    handleResponse(answer) {
      if (this.response.length > 0) {
        const index = this.response.findIndex(
          (res) => res.executiveId == answer.executiveId
        );
        if (index != -1) {
          const indexDate = this.response[index].timeSlot.findIndex(
            (slot) => slot.date == answer.timeSlot[0].date
          );
          if (indexDate != -1) {
            this.response[index].timeSlot[indexDate].preferredTime =
              answer.timeSlot[0].preferredTime;
          } else {
            this.response[index].timeSlot.push(answer.timeSlot[0]);
          }
        } else {
          this.response.push(answer);
        }
      } else {
        this.response.push(answer);
      }
    },
    async confirmResponse() {
      this.dataToBe.responses = this.response;
      await this.$store.dispatch("replyToBeConfirmed", this.dataToBe);
      this.dataToBe.id = null;
      this.selectedId = null;
      this.inboxDetail = null;
      this.$router.go(-1);
    },
  },
  created() {
    this.getBeConfirmedDetail();
    this.dataToBe.id = parseInt(this.id);
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
@media (min-width: 27em) {.expired-date {font-size: 1.6rem !important;}}
.loading-container {height: 100vh;.failed {width: 60%;text-align: center;row-gap: 1rem;.header-fail {font-size: 4rem;font-weight: 600;color: $primaryViolet;}.image {width: 20rem;height: 20rem;img {width: 100%;height: 100%;object-fit: contain;}}}}
.loading {height: 100vh;color: $highlightViolet;animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}
.expired {filter: grayscale(1);opacity: 0.5;pointer-events: none;}
.expired-date {font-size: 2rem;font-weight: 500;color: $primaryViolet;line-height: 1.6;span {color: $error;}}
.response {display: flex;flex-direction: column;row-gap: 1rem;height: 100%;overflow: scroll;margin: 1rem 0;.response-container {margin: 2.5rem 0;.day {color: $darkViolet;}}}
.response::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1rem;}
.response::-webkit-scrollbar-track {margin: 1rem;border-radius: 0.5rem;}
.response::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}
.response::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}
</style>