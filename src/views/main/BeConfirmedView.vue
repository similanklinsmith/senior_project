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
            :inbox="inbox"
            :selectedId="selectedId"
            @selectInbox="selectInbox"
          />
          <div v-if="filterByTitle.length == 0" class="remark-text not-found">
            Not found
          </div>
        </transition-group>
      </div>
    </div>
    <div class="inbox-detail" v-if="selectedInbox != null">
      <div class="title remark-text">{{ selectedInbox.title }}</div>
      <div class="sent-from smallest-text">
        sent from Katherine Perish at 11:30 AM 04 Apr 2022
      </div>
      <div class="response">
        <div class="day bold-content-text">Wednesday, April 06, 2022</div>
        <div class="executive-response">
          <div class="executive-name bold-small-text">
            Similan Klinsmith <span>(required)</span>
          </div>
          <div class="buttons">
            <BaseButton
              btnText="Accept"
              textHover="white"
              color="#39CF5A"
              hoverColor="#2eba4c"
              width="100%"
              fontSize="1.4rem"
              :class="isAccept ? 'common-button' : 'outlined-button'"
              :style="isAccept ? { color: 'white' } : { color: '#39CF5A' }"
              @onClick="(isAccept = true), (isDecline = false)"
            >
              <template v-slot:after-icon>
                <i class="fa-solid fa-check"></i>
              </template>
            </BaseButton>
            <BaseButton
              btnText="Decline"
              textHover="white"
              color="#F33C3C"
              hoverColor="#d93333"
              width="100%"
              fontSize="1.4rem"
              :class="isDecline ? 'common-button' : 'outlined-button'"
              :style="isDecline ? { color: 'white' } : { color: '#F33C3C' }"
              @onClick="(isDecline = true), (isAccept = false)"
            >
              <template v-slot:after-icon>
                <i class="fa-solid fa-xmark"></i>
              </template>
            </BaseButton>
          </div>
        </div>
        <div class="add-time-slot" v-if="isAccept">
          <div class="bold-smallest-text">Preferred-timeslots</div>
          <BaseButton
            buttonType="texted-button"
            btnText="Add/Delete Timeslot"
            textColor="#7452FF"
            textHover="#23106D"
            fontSize="1.4rem"
            @onClick="isAddTimeSlot = true"
          >
            <template v-slot:before-icon>
              <i class="fa-solid fa-clock"></i>
            </template>
          </BaseButton>
        </div>
        <teleport to="#portal-target">
          <div class="modal" @click="isAddTimeSlot = false"></div>
          <div class="pop-up">
            <div class="title bold-content-text">Timeslots</div>
            <div class="form">
              <div class="input-form">
                <label for="date" class="bold-small-text">Date</label>
                <input
                  class="small-text"
                  type="date"
                  placeholder="date"
                  id="date"
                  name="date"
                  :value="form.date"
                  readonly
                />
              </div>
              <div class="input-form">
                <label for="from" class="bold-small-text">From</label>
                <input
                  class="small-text"
                  type="time"
                  placeholder="HH:MM"
                  id="from"
                  name="from"
                />
              </div>
              <div class="input-form">
                <label for="to" class="bold-small-text">To</label>
                <input
                  class="small-text"
                  type="time"
                  placeholder="HH:MM"
                  id="to"
                  name="to"
                />
              </div>
              <BaseButton
                buttonType="common-button"
                btnText="Add"
                textColor="white"
                textHover="white"
                color="#7452FF"
                hoverColor="#23106D"
                height="4rem"
              >
                <template v-slot:after-icon>
                  <i class="icon fa-solid fa-plus"></i>
                </template>
                ></BaseButton
              >
            </div>
          </div>
        </teleport>
      </div>
    </div>
  </div>
</template>

<script>
import InboxComp from "../../components/meeting/InboxComp.vue";
import BaseButton from "../../components/UI/BaseButton.vue";
export default {
  name: "BeConfirmedView",
  components: { InboxComp, BaseButton },
  data() {
    return {
      searchInput: "",
      toBeConfirmedList: [],
      selectedInbox: null,
      selectedId: null,
      isAddTimeSlot: false,
      isAccept: false,
      isDecline: false,
      form: {
        date: "2022-04-06",
        from: "",
        to: "",
      },
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
  },
  mounted() {
    this.toBeConfirmedList = [
      {
        id: "1",
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
      {
        id: "2",
        title: "Let's have meeting",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
      {
        id: "3",
        title: "Whatcha doin today everyone?",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
      {
        id: "4",
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
      {
        id: "5",
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
      {
        id: "6",
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
    ];
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
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
.pop-up {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  z-index: 12;
  border-radius: 2.5rem;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  background-color: $white;
  width: 80rem;
  padding: 2.4rem;
  animation-name: appears;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  .title {
    color: $primaryViolet;
  }
  .form {
    display: flex;
    justify-content: space-around;
    column-gap: 1rem;
    align-items: flex-end;
    .input-form {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    select,
    input {
      margin-top: 1rem;
      padding: 1rem 1.4rem;
      width: 100%;
      height: 4rem;
      border-radius: 0.5rem;
      border: none;
      background-color: $primaryGrey;
      font-family: "Poppins", sans-serif;
    }
    input:focus {
      outline: none;
      border: 0.1rem solid $primaryViolet;
    }
    select::placeholder,
    input::placeholder {
      font-size: 1.4rem;
      color: $darkGrey;
    }
    select {
      font-size: 1.4rem;
    }
    select:focus {
      outline: none;
      border: 0.1rem solid $primaryViolet;
    }
  }
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
    .response {
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
      .day {
        color: $darkViolet;
      }
      .executive-response {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          color: $primaryViolet;
        }
      }
      .buttons {
        display: flex;
        column-gap: 0.5rem;
      }
      .add-time-slot {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .bold-smallest-text {
          color: $darkGrey;
        }
      }
    }
  }
}
</style>
