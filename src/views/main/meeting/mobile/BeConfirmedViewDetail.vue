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
          <span>*</span>This form will be expired in
          {{ inboxDetail.due_date_time.split("T")[0] }}
          <span v-if="new Date(inboxDetail.due_date_time) >= new Date()"
            >({{ calculateRemainingDay(inboxDetail.due_date_time) }} days
            left)</span
          >
          <span v-else>(Already expired)</span>
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
              {{ formatDateTimeHeader(periodOfTime.date) }}
            </div>
            <ResponseComp
              @onResponse="handleResponse"
              v-for="executive in periodOfTime.executives"
              :key="executive.executive_id"
              :executive="executive"
              :date="periodOfTime.date"
              :duration="inboxDetail.duration_of_time"
              :dateTimeHeader="formatDateTimeHeader(periodOfTime.date)"
            />
          </div>
        </div>
        <BaseButton
          v-if="responseAll"
          buttonType="common-button"
          btnText="Confirm response"
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
</template>

<script>
import MaskMeetingDetailMobile from "@/components/meeting/MaskMeetingDetailMobile.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import ResponseComp from "@/components/meeting/ResponseComp.vue";
import { mapGetters, mapActions } from "vuex";
import { useRoute } from "vue-router";
import { formatDateTimeHeader } from "@/helpers/formatDateTime";
export default {
  name: "BeConfirmedViewDetail",
  components: { MaskMeetingDetailMobile, ResponseComp, BaseButton },
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const type = route.params.type;
    return { id, type };
  },
  data() {
    return {
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
              isValid = this.response[index].timeSlot[i].preferredTime.length != 0;
              if (isValid == false) {
                return isValid
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
      try {
        this.inboxDetail = await this.$store.dispatch(
          "getMyBeConfirmedDetail",
          this.id
        );
        console.log(this.inboxDetail);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    formatDateTimeHeader(dateTime) {
      return formatDateTimeHeader(dateTime);
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
            console.log(answer.timeSlot[0].preferredTime);
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
    confirmResponse() {
      this.dataToBe.responses = this.response;
      console.log(this.response);
      console.log(this.dataToBe);
    },
  },
  created() {
    console.log(`This is params id: ${this.id}`);
    console.log(`This is params type: ${this.type}`);
    this.getBeConfirmedDetail();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
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
.response {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 100%;
  overflow: scroll;
  margin: 1rem 0;
  .response-container {
    margin: 2.5rem 0;
    .day {
      color: $darkViolet;
    }
  }
}
.response::-webkit-scrollbar {
  display: block !important;
  -ms-overflow-style: auto !important;
  scrollbar-width: auto !important;
  background-color: transparent;
  width: 1rem;
}
.response::-webkit-scrollbar-track {
  margin: 1rem;
  border-radius: 0.5rem;
}
.response::-webkit-scrollbar-thumb {
  background-color: $grey;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}
.response::-webkit-scrollbar-thumb:hover {
  background-color: $darkGrey;
}
</style>
