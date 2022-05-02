<template>
  <div class="response-container">
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
      <div class="bold-smallest-text label-text">Preferred-timeslots</div>
      <div class="show-time-slot" v-for="time in timeSlots" :key="time">
        <div class="bold-smallest-text">
          From {{ time.from }}, End with {{ time.to }}
        </div>
      </div>
      <BaseButton
        buttonType="texted-button"
        btnText="Add/Delete Timeslot"
        textColor="#7452FF"
        textHover="#23106D"
        fontSize="1.4rem"
        @onClick="handleAddTimeSlot('2022-04-06')"
      >
        <template v-slot:before-icon>
          <i class="fa-solid fa-clock"></i>
        </template>
      </BaseButton>
    </div>
    <teleport to="#portal-target" v-if="isAddTimeSlot">
      <div class="modal" @click="handleCloseTimeSlot"></div>
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
              :value="timeSlot.date"
              readonly
            />
          </div>
          <div class="input-form">
            <label for="from" class="bold-small-text"
              >From<span class="required">* {{ errors.from }} </span></label
            >
            <input
              class="small-text"
              type="time"
              placeholder="HH:MM"
              id="from"
              name="from"
              v-model="timeSlot.from"
            />
          </div>
          <div class="input-form">
            <label for="to" class="bold-small-text"
              >To<span class="required">* {{ errors.to }} </span></label
            >
            <input
              class="small-text"
              type="time"
              placeholder="HH:MM"
              id="to"
              name="to"
              v-model="timeSlot.to"
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
            @onClick="addTimeSlot"
          >
            <template v-slot:after-icon>
              <i class="icon fa-solid fa-plus"></i>
            </template>
            ></BaseButton
          >
        </div>
        <div class="time-slots">
          <div
            class="time-slot"
            v-for="(slot, index) in filterTimeSlots(timeSlot.date)"
            :key="slot"
          >
            <div class="row">
              <div class="column">
                <div class="bold-small-text">Wednesday, April 06, 2022</div>
                <div class="small-text">
                  From {{ slot.from }} to {{ slot.to }}
                </div>
              </div>
              <BaseButton
                buttonType="common-button"
                btnText="Delete"
                textColor="white"
                textHover="white"
                color="#F33C3C"
                hoverColor="#d93333"
                height="4rem"
                width="fit-content"
                @onClick="deleteTimeSlot(index)"
              >
                <template v-slot:before-icon>
                  <i class="icon fa-solid fa-trash"></i>
                </template>
                ></BaseButton
              >
            </div>
          </div>
        </div>
        <div class="confirm-button">
          <div></div>
          <BaseButton
            buttonType="common-button"
            btnText="Confirm"
            textColor="white"
            textHover="white"
            color="#7452FF"
            hoverColor="#23106D"
            height="4rem"
            width="20rem"
            @onClick="handleConfirm"
          >
            ></BaseButton
          >
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import BaseButton from "../../components/UI/BaseButton.vue";
export default {
  name: "ResponseComp",
  components: { BaseButton },
  data() {
    return {
      isAddTimeSlot: false,
      isAccept: false,
      isDecline: false,
      timeSlots: [],
      selectTimeSlots:[],
      timeSlot: {
        date: null,
        from: null,
        to: null,
      },
      errors: {},
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
    fromTimeIsValid() {
      return !!this.timeSlot.from;
    },
    toTimeIsValid() {
      return !!this.timeSlot.to;
    },
  },
  methods: {
    handleAddTimeSlot(date) {
      this.isAddTimeSlot = true;
      this.timeSlot.date = date;
      if (this.timeSlots.length != 0) {
        this.selectTimeSlots = this.timeSlots
      }
    },
    handleCloseTimeSlot() {
      this.isAddTimeSlot = false;
      this.selectTimeSlots = [];
      console.log(this.timeSlots);
    },
    handleConfirm() {
        console.log(this.selectTimeSlots);
        this.timeSlots = [...this.selectTimeSlots];
        this.selectTimeSlots = [];
        this.isAddTimeSlot = false;
        console.log(this.timeSlots);
    },
    selectInbox(id) {
      this.selectedInbox = this.toBeConfirmedList.find((toBeConfirmed) => {
        this.selectedId = id;
        return toBeConfirmed.id == id;
      });
    },
    addTimeSlot() {
      this.fromTimeIsValid
        ? delete this.errors.from
        : (this.errors.from = "Please choose");
      this.toTimeIsValid
        ? delete this.errors.to
        : (this.errors.to = "Please choose");
      if (Object.keys(this.errors).length == 0) {
        var selectedTime = {
          date: this.timeSlot.date,
          from: this.timeSlot.from,
          to: this.timeSlot.to,
        };
        this.selectTimeSlots.push(selectedTime)
        // this.timeSlots.push(selectedTime);
        this.timeSlot.from = "";
        this.timeSlot.to = "";
        // console.log(this.timeSlots);
      }
    },
    deleteTimeSlot(index) {
      this.selectTimeSlots.splice(index, 1);
    },
    filterTimeSlots(date) {
      return this.selectTimeSlots.filter((slot) => {
        return slot.date == date;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.response-container {
  margin: 2.5rem 0;
}
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
  background-color: $white;
  width: 80rem;
  padding: 2.4rem;
  animation-name: appears;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  .required {
    color: $error;
    margin-left: 0.2rem;
  }
  .confirm-button {
    display: flex;
    justify-content: space-between;
  }
  .time-slots {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    height: 24rem;
    overflow: scroll;
    margin-bottom: 1rem;
    .time-slot {
      width: 100%;
      height: auto;
      padding: 1.2rem 3.2rem;
      background-color: $fadedViolet;
      border-radius: 1rem;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .column {
          display: flex;
          flex-direction: column;
          row-gap: 0.5rem;
          .bold-small-text {
            color: $darkViolet;
          }
          .small-text {
            color: $white;
          }
        }
      }
    }
  }
  .title {
    color: $primaryViolet;
  }
  .form {
    display: flex;
    justify-content: space-around;
    column-gap: 1rem;
    align-items: flex-end;
    margin-bottom: 2rem;
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
  .label-text {
    margin-bottom: 1rem;
  }
  .bold-smallest-text {
    color: $darkGrey;
  }
  .show-time-slot {
    width: fit-content;
    border: 1px solid $darkViolet;
    padding: 1.2rem 1.8rem;
    border-radius: 0.5rem;
    margin: 0.25rem 0;
    .bold-smallest-text {
      color: $darkViolet !important;
    }
  }
}
</style>