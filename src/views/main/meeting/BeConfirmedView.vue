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
            :content="'Response poll appointment'"
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
          sent on {{ formatDateTime(selectedInbox.create_at) }} by
          <span
            >{{ selectedInbox.secretary.first_name }}
            {{ selectedInbox.secretary.last_name }}</span
          >
          &lt;{{ selectedInbox.secretary.email }}&gt;
        </div>
        <div class="bold-small-text due-date">
          <span>*</span>This form will be expired in
          {{ selectedInbox.due_date_time.split("T")[0] }}
          <span v-if="new Date(selectedInbox.due_date_time) >= new Date()"
            >({{ calculateRemainingDay(selectedInbox.due_date_time) }} days
            left)</span
          >
          <span v-else>(Already expired)</span>
        </div>
        <div
          class="response"
          :class="`${
            new Date(selectedInbox.due_date_time) < new Date() ? 'expired' : ''
          }`"
        >
          <div
            class="response-container"
            v-for="(periodOfTime, index) in selectedInbox.periodOfTime"
            :key="index"
          >
            <div class="day bold-content-text">
              {{ formatDateTimeHeader(periodOfTime.date) }}
            </div>
            <ResponseComp
              @onResponse="handleResponse"
              v-for="executive in periodOfTime.executives"
              :key="executive.executive_id"
              :executive="executive"
              :date="periodOfTime.date"
              :duration="selectedInbox.duration_of_time"
              :dateTimeHeader="formatDateTimeHeader(periodOfTime.date)"
            />
          </div>
        </div>
        <div class="button">
          <BaseButton
            v-if="responseAll"
            buttonType="common-button"
            btnText="Confirm response"
            textColor="white"
            textHover="white"
            color="#7452FF"
            hoverColor="#23106D"
            width="24rem"
            @onClick="confirmResponse"
          >
          </BaseButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import InboxComp from "@/components/meeting/InboxComp.vue";
import ResponseComp from "@/components/meeting/ResponseComp.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import {
  formatDateTimeDetail,
  formatDateTimeHeader,
} from "@/helpers/formatDateTime";
export default {
  name: "BeConfirmedView",
  components: { InboxComp, ResponseComp, BaseButton },
  data() {
    return {
      searchInput: "",
      toBeConfirmedList: [],
      selectedInbox: null,
      selectedId: null,
      dataToBe: {},
      response: [],
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
    responseAll() {
      let isValid;
      if (
        this.response.length > 0 &&
        this.response.length == this.selectedInbox.periodOfTime.length
      ) {
        for (let index = 0; index < this.response.length; index++) {
          isValid =
            this.response[index].timeSlot.length ==
            this.selectedInbox.periodOfTime.length;
        }
        return isValid;
      } else {
        return false;
      }
    },
  },
  methods: {
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
    formatDateTime(dateTime) {
      return formatDateTimeDetail(dateTime);
    },
    formatDateTimeHeader(dateTime) {
      return formatDateTimeHeader(dateTime);
    },
    selectInbox(id) {
      this.dataToBe.id = id;
      this.selectedInbox = this.toBeConfirmedList.find((toBeConfirmed) => {
        this.selectedId = id;
        return toBeConfirmed.id == id;
      });
    },
  },
  mounted() {
    this.toBeConfirmedList = [
      {
        id: "1",
        title: "Discover what’s happened this week",
        create_at: "2022-05-15T07:40:32.000Z",
        due_date_time: "2022-08-20T07:40:32.000Z",
        duration_of_time: "2",
        secretary: {
          id: 1,
          first_name: "Jennie",
          last_name: "Kim",
          email: "jennie@mail.kmutt.ac.th",
        },
        periodOfTime: [
          {
            date: "2022-08-25",
            executives: [
              {
                executive_id: "1",
                first_name: "Similan",
                last_name: "Klinsmith",
              },
              {
                executive_id: "2",
                first_name: "Noparat",
                last_name: "Prasongdee",
              },
              {
                executive_id: "3",
                first_name: "Praepanwa",
                last_name: "Tedprasit",
              },
            ],
          },
          {
            date: "2022-08-26",
            executives: [
              {
                executive_id: "1",
                first_name: "Similan",
                last_name: "Klinsmith",
              },
              {
                executive_id: "2",
                first_name: "Noparat",
                last_name: "Prasongdee",
              },
              {
                executive_id: "3",
                first_name: "Praepanwa",
                last_name: "Tedprasit",
              },
            ],
          },
          {
            date: "2022-08-27",
            executives: [
              {
                executive_id: "1",
                first_name: "Similan",
                last_name: "Klinsmith",
              },
              {
                executive_id: "2",
                first_name: "Noparat",
                last_name: "Prasongdee",
              },
              {
                executive_id: "3",
                first_name: "Praepanwa",
                last_name: "Tedprasit",
              },
            ],
          },
        ],
      },
      {
        id: "2",
        title: "Discover what’s happened this week",
        create_at: "2022-05-15T07:40:32.000Z",
        due_date_time: "2022-08-30T07:40:32.000Z",
        duration_of_time: "2",
        secretary: {
          id: 1,
          first_name: "Jennie",
          last_name: "Kim",
          email: "jennie@mail.kmutt.ac.th",
        },
        periodOfTime: [
          {
            date: "2022-08-25",
            executives: [
              {
                executive_id: "1",
                first_name: "Similan",
                last_name: "Klinsmith",
              },
              {
                executive_id: "2",
                first_name: "Noparat",
                last_name: "Prasongdee",
              },
              {
                executive_id: "3",
                first_name: "Praepanwa",
                last_name: "Tedprasit",
              },
            ],
          },
          {
            date: "2022-08-26",
            executives: [
              {
                executive_id: "1",
                first_name: "Similan",
                last_name: "Klinsmith",
              },
              {
                executive_id: "2",
                first_name: "Noparat",
                lastname: "Prasongdee",
              },
              {
                executive_id: "3",
                first_name: "Praepanwa",
                last_name: "Tedprasit",
              },
            ],
          },
          {
            date: "2022-08-27",
            executives: [
              {
                executive_id: "1",
                first_name: "Similan",
                last_name: "Klinsmith",
              },
              {
                executive_id: "2",
                first_name: "Noparat",
                last_name: "Prasongdee",
              },
              {
                executive_id: "3",
                first_name: "Praepanwa",
                last_name: "Tedprasit",
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
.expired {
  filter: grayscale(1);
  opacity: 0.5;
  pointer-events: none;
}
.response {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 50rem;
  overflow: scroll;
  margin: 1rem 0;
  padding: 0 1rem;
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
    height: fit-content;
    background-color: $white;
    border-radius: 2.5rem;
    padding: 5rem 4.4rem;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .due-date {
      margin-top: 2rem;
      color: $primaryViolet;
      span {
        color: $error;
      }
    }
    .sent-from {
      color: $darkGrey;
      span {
        text-decoration: underline;
      }
    }
    .button {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
