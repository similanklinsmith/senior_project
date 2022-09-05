<template>
  <div class="replied-body-section">
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
      <div v-if="selectedId != null">
        <div class="inbox-detail">
          <div class="inbox-detail-content">
            <div class="title remark-text">{{ selectedInbox.title }}</div>
            <div class="sent-from smallest-text">
              sent on {{ formatDateTime(selectedInbox.create_at) }} by
              <span>{{ selectedInbox.secretary.name }}</span>
              &lt;{{ selectedInbox.secretary.email }}&gt;
            </div>
            <div class="line" />
            <div class="response">
              <div
                class="response-container"
                v-for="(executive, index) in selectedInbox.executives"
                :key="index"
              >
                <div>
                  <div class="name bold-content-text">
                    {{ executive.first_name }} {{ executive.last_name }}
                    <span>(required)</span>
                  </div>
                  <div class="bold-smallest-text label-text">
                    Preferred-timeslots
                  </div>
                </div>
                <div
                  v-for="(response, index) in executive.responses"
                  :key="index"
                  class="days"
                >
                  <div
                    class="bold-small-text"
                    :style="
                      response.is_accept
                        ? { color: '#39CF5A' }
                        : { color: '#F33C3C' }
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
                      <div class="bold-smallest-text">
                        From {{ time.from }}, End with {{ time.to }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import InboxComp from "@/components/meeting/InboxComp.vue";
// import { mapGetters, mapActions } from "vuex";
import {
  formatDateTimeDetail,
  formatDateTimeHeader,
} from "@/helpers/formatDateTime";
export default {
  name: "BeConfirmedView",
  components: { InboxComp },
  data() {
    return {
      searchInput: "",
      repliedList: [],
      selectedInbox: null,
      inboxDetail: null,
      selectedId: null,
      isLoading: false,
    };
  },
  computed: {
    // ...mapGetters(["getterMyBeConfirmeds", "getterMyBeConfirmedDetail"]),
    // getBeConfirmedList() {
    //   return this.$store.getters.getterMyBeConfirmeds;
    // },
    filterByTitle() {
      return this.repliedList.filter((reply) => {
        return reply.title
          .toLowerCase()
          .includes(this.searchInput.toLowerCase());
      });
    },
  },
  methods: {
    // ...mapActions(["getMyBeConfirmeds", "getMyBeConfirmedDetail"]),
    calculateRemainingDay(date) {
      return Math.round(
        (new Date(date) - new Date(Date.now())) / (24 * 60 * 60 * 1000)
      ) < 0
        ? 0
        : Math.round(
            (new Date(date) - new Date(Date.now())) / (24 * 60 * 60 * 1000)
          );
    },
    formatDateTime(dateTime) {
      return formatDateTimeDetail(dateTime);
    },
    formatDateTimeHeader(dateTime) {
      return formatDateTimeHeader(dateTime);
    },
    async selectInbox(id) {
      this.selectedId = id;
      this.isLoading = true;
      this.selectedInbox = this.repliedList.find((reply) => {
        return reply.id == id;
      });
      //   try {
      //     this.inboxDetail = await this.$store.dispatch(
      //       "getMyBeConfirmedDetail",
      //       this.selectedId
      //     );
      //     console.log(this.inboxDetail);
      //     this.isLoading = false;
      //   } catch (error) {
      //     this.isLoading = false;
      //   }
    },
  },
  created() {
    // this.getMyBeConfirmeds();
  },
  mounted() {
    this.repliedList = [
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
      },
    ];
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.response {
  height: 50rem;
  overflow: scroll;
  margin: 1.5rem 0;
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
.replied-body-section {
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
    flex-direction: column;
    display: flex;
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
    .loading {
      animation-name: floating;
      -webkit-animation-name: floating;
      animation-duration: 3s;
      -webkit-animation-duration: 3s;
      animation-iteration-count: infinite;
      -webkit-animation-iteration-count: infinite;
    }
    .line {
      width: 100%;
      height: 0.1rem;
      background-color: $bgColor;
      margin: 2rem 0;
    }
    .inbox-detail-content {
      overflow: scroll;
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
}
</style>
