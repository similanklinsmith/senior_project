<template>
  <!-- <div v-if="!isLoading && inboxDetail != null"> -->
  <MaskMeetingDetailMobile
    :title="responses.title"
    :dateTime="responses.create_at"
    :type="'replied'"
    :sender="responses.secretary.first_name +' '+ responses.secretary.last_name"
  >
    <template v-slot:detail-slot>
      <div class="line" />
      <div class="response">
        <div
          class="response-container"
          v-for="(executive, index) in responses.executives"
          :key="index"
        >
          <div>
            <div class="name remark-text">
              {{ executive.first_name }} {{ executive.last_name }}
              <span>(required)</span>
            </div>
            <div class="bold-small-text label-text">Preferred-timeslots</div>
          </div>
          <div
            v-for="(response, index) in executive.responses"
            :key="index"
            class="days"
          >
            <div
              class="bold-content-text"
              :style="
                response.is_accept ? { color: '#39CF5A' } : { color: '#F33C3C' }
              "
            >
              {{ formatDateTimeHeader(response.date) }}
              <span v-if="!response.is_accept">(Declined)</span>
            </div>
            <div class="slots">
              <div
                class="show-time-slot"
                v-for="time in response.periodOfTime"
                :key="time"
              >
                <div class="bold-content-text">
                  From {{ time.from }}, End with {{ time.to }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </MaskMeetingDetailMobile>
  <!-- </div> -->
</template>

<script>
/* eslint-disable */
import MaskMeetingDetailMobile from "@/components/meeting/MaskMeetingDetailMobile.vue";
import ResponseComp from "@/components/meeting/ResponseComp.vue";
import { mapGetters, mapActions } from "vuex";
import { useRoute } from "vue-router";
import { formatDateTimeHeader } from "@/helpers/formatDateTime";
export default {
  name: "BeConfirmedViewDetail",
  components: { MaskMeetingDetailMobile, ResponseComp },
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
      responses: null
    };
  },
  computed: {
    // ...mapGetters(["getterMyBeConfirmedDetail"]),
    // responseAll() {
    //   var isValid;
    //   if (this.response.length > 0 && this.response.length == this.inboxDetail.periodOfTime[0].executives.length) {
    //     for (let index = 0; index < this.response.length; index++) {
    //       isValid = this.response[index].timeSlot.length == this.inboxDetail.periodOfTime.length
    //       if (isValid == false) {
    //         return false;
    //       }
    //       for (let i = 0; i < this.response[index].timeSlot.length; i++) {
    //         if (this.response[index].timeSlot[i].status == 'accepted') {
    //           isValid = this.response[index].timeSlot[i].preferredTime.length;
    //           console.log(isValid);
    //           return isValid;
    //         }
    //       }
    //     }
    //     return isValid;
    //   }
    //   return false;
    // },
  },
  methods: {
    // ...mapActions(["getMyBeConfirmedDetail"]),
    // async getBeConfirmedDetail() {
    //   try {
    //     this.inboxDetail = await this.$store.dispatch(
    //       "getMyBeConfirmedDetail",
    //       this.id
    //     );
    //     console.log(this.inboxDetail);
    //     this.isLoading = false;
    //   } catch (error) {
    //     this.isLoading = false;
    //   }
    // },
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
    this.responses = 
      {
        id: "1",
        title: "Discover what’s happened this week",
        create_at: "2022-05-15T07:40:32.000Z",
        secretary: {
          id: 1,
          first_name: "Jennie",
          last_name: "Kim",
          email: "jennie@mail.kmutt.ac.th",
        },
        executives: [
          {
            executive_id: "1",
            first_name: "Similan",
            last_name: "Klinsmith",
            responses: [
              {
                date: "2022-08-25",
                is_accept: true,
                periodOfTime: [
                  {
                    from: "11:00",
                    to: "14:00",
                  },
                  {
                    from: "15:00",
                    to: "17:00",
                  },
                ],
              },
              {
                date: "2022-08-26",
                is_accept: false,
                periodOfTime: [],
              },
            ],
          },
          {
            executive_id: "2",
            first_name: "Noparat",
            last_name: "Prasongdee",
            responses: [
              {
                date: "2022-08-25",
                is_accept: true,
                periodOfTime: [
                  {
                    from: "12:00",
                    to: "15:00",
                  },
                ],
              },
              {
                date: "2022-08-26",
                is_accept: true,
                periodOfTime: [
                  {
                    from: "10:00",
                    to: "13:00",
                  },
                  {
                    from: "15:00",
                    to: "17:00",
                  },
                ],
              },
            ],
          },
        ],
      };
    // this.getBeConfirmedDetail();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.response {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 100%;
  overflow: scroll;
  margin: 1rem 0;
  padding: 0 1rem;
  .response-container {
    display: flex;
    flex-direction: column;
    row-gap: 2.4rem;
    .name {
      span {
        color: $primaryViolet;
        font-weight: 400;
      }
    }
    .label-text {
      margin-top: 1rem;
      color: $darkGrey;
    }
    .days {
      display: flex;
      flex-direction: column;
      row-gap: 2rem;
    }
    .slots {
      display: flex;
      flex-direction: column;
      row-gap: 0.25rem;
      .show-time-slot {
        width: fit-content;
        border: 1px solid $darkViolet;
        padding: 1.8rem 2.2rem;
        border-radius: 0.5rem;
        margin: 0.25rem 0;
        .bold-smallest-text {
          color: $darkViolet !important;
        }
      }
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
