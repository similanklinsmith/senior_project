<template>
  <div class="sent-body-section">
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
            :title="inbox.tittle"
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
        <div class="title remark-text">{{ selectedInbox.tittle }}</div>
        <div class="sent-from smallest-text">
          sent from Katherine Perish at {{selectedInbox.create_at}}
        </div>
        <div class="content">
          <div class="attendees">
            <div class="bold-small-text">Attendees:</div>
            <div class="small-text attendee-list">
              Mr. Similan Klinsmith, Ms. Noparat Prasongdee
            </div>
            <div class="see-more bold-small-text">see more</div>
          </div>
          <div class="time-slots">
            <div class="bold-small-text faded">Timeslots</div>
            <div class="slot">
              <div class="start">
                <div class="bold-small-text">Start Date:</div>
                <div class="small-text">
                  {{ selectedInbox.start_date.split("T")[0] }}
                </div>
              </div>
              <div class="end">
                <div class="bold-small-text">End Date:</div>
                <div class="small-text">
                  {{ selectedInbox.end_date.split("T")[0] }}
                </div>
              </div>
            </div>
          </div>
          <div class="duration">
            <div class="bold-small-text">Durations of meeting:</div>
            <div class="small-text">
              {{ selectedInbox.duration_of_time }} hour&#40;s&#41;
            </div>
          </div>
          <div class="due-date">
            <div class="bold-small-text">Due Date:</div>
            <div class="small-text">
              {{ selectedInbox.due_date_time.split("T")[0] }}
              <div class="remaining-day">
                &#40;{{
                  calculateRemainingDay(selectedInbox.due_date_time)
                }}
                days remaining&#41;
              </div>
            </div>
          </div>
        </div>
        <div class="button">
          <BaseButton
            buttonType="common-button"
            btnText="Delete Poll"
            textColor="white"
            textHover="white"
            color="#F33C3C"
            hoverColor="#d93333"
            width="fit-content"
          >
          </BaseButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import InboxComp from "../../../components/meeting/InboxComp.vue";
import BaseButton from "../../../components/UI/BaseButton.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "InboxView",
  components: { InboxComp, BaseButton },
  data() {
    return {
      searchInput: "",
      selectedInbox: null,
      selectedId: null,
    };
  },
  computed: {
    ...mapGetters(["getterMyPolls"]),
    getPollsList() {
      return this.$store.getters.getterMyPolls;
    },
    filterByTitle() {
      return this.getPollsList.filter((toBeConfirmed) => {
        return toBeConfirmed.tittle
          .toLowerCase()
          .includes(this.searchInput.toLowerCase());
      });
    },
    formatDateTime(dateTime) {
      var currentdate = new Date();
      var now = `${currentdate.getFullYear()}-${(
        "0" +
        (currentdate.getMonth() + 1)
      ).slice(-2)}-${("0" + currentdate.getDate()).slice(-2)}`;
      if (
        new Date(now).toDateString() ==
        new Date(dateTime.split("T")[0]).toDateString()
      ) {
        var date = new Date(dateTime);
        let hours = date.getHours();
        let ampm = hours >= 12 ? "PM" : "AM";
        return dateTime.split("T")[1].split(".")[0].slice(0, 5) + " " + ampm;
      } else {
        return dateTime.split("T")[0];
      }
    },
  },
  methods: {
    ...mapActions(["getMyPolls"]),
    selectInbox(id) {
      this.selectedInbox = this.getPollsList.find((toBeConfirmed) => {
        this.selectedId = id;
        return toBeConfirmed.id == id;
      });
    },
    calculateRemainingDay(date) {
      return Math.round(
        Math.abs(
          (new Date(Date.now()) - new Date(date)) / (24 * 60 * 60 * 1000)
        )
      );
    },
  },
  created() {
    this.getMyPolls();
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/colors/webColors.scss";
.response {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 50rem;
  overflow: scroll;
  margin: 1rem 0;
  padding: 0 1rem;
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
.sent-body-section {
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
    .content {
      margin-top: 3rem;
      margin-bottom: 3rem;
      display: flex;
      row-gap: 4rem;
      flex-direction: column;
      .attendees {
        display: flex;
        column-gap: 0.5rem;
        .attendee-list {
          color: $primaryViolet;
        }
        .see-more {
          color: $primaryViolet;
          text-decoration: underline;
          cursor: pointer;
          transition: 0.2s all ease-in-out;
          &:hover {
            color: $darkViolet;
          }
        }
      }
      .time-slots {
        display: flex;
        flex-direction: column;
        row-gap: 2rem;
        .faded {
          color: $darkGrey;
        }
        .slot {
          display: flex;
          column-gap: 8rem;
          .start,
          .end {
            display: flex;
            column-gap: 0.5rem;
            .small-text {
              color: $primaryViolet;
            }
          }
        }
      }
      .duration,
      .due-date {
        display: flex;
        column-gap: 0.5rem;
        .small-text {
          color: $primaryViolet;
          display: flex;
          column-gap: 0.5rem;
          .remaining-day {
            color: $error;
          }
        }
      }
    }
    .button {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
