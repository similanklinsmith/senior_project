<template>
  <div>
    <div class="executive-response">
      <div class="executive-name bold-small-text">
        {{ executive.first_name }} {{ executive.last_name }}
        <span class="desktop">(required)</span>
        <span class="mobile">*</span>
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
          @onClick="handleAccept(executive.id)"
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
          @onClick="handleDecline(executive.id)"
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
        @onClick="handleAddTimeSlot"
      >
        <template v-slot:before-icon>
          <i class="fa-solid fa-clock"></i>
        </template>
      </BaseButton>
    </div>
    <teleport to="#portal-target" v-if="isAddTimeSlot">
      <div class="modal"></div>
      <div class="pop-up">
        <div class="title remark-text">Timeslots</div>
        <div class="duration bold-content-text">
          Duration<span class="duration-label">{{ duration }} hour(s)</span>
        </div>
        <div class="form">
          <div class="input-form">
            <label for="date" class="bold-small-text"
              >Date <span class="gray-format">(mm/dd/yyyy)</span></label
            >
            <input
              class="small-text readonly"
              type="date"
              placeholder="date"
              id="date"
              name="date"
              :value="date"
              readonly
            />
          </div>
          <div class="input-form">
            <label for="from" class="bold-small-text"
              >From<span class="required"
                >* {{ errors.from }} {{ errors.interval }}</span
              ></label
            >
            <input
              class="small-text"
              type="time"
              placeholder="HH:MM"
              id="from"
              name="from"
              v-model="timeSlot.from"
              @change="triggerFillToTime"
            />
          </div>
          <div class="input-form">
            <label for="to" class="bold-small-text">To</label>
            <input
              class="small-text readonly"
              type="time"
              placeholder="HH:MM"
              id="to"
              name="to"
              v-model="timeSlot.to"
              readonly
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
        <div
          class="error-container bold-content-text"
          v-if="errors.overlap || errors.duration"
        >
          {{ errors.overlap }} {{ errors.duration }}
        </div>
        <div class="time-slots">
          <div
            class="time-slot"
            v-for="(slot, index) in selectTimeSlots"
            :key="slot"
          >
            <div class="row">
              <div class="column">
                <div class="bold-small-text">{{ dateTimeHeader }}</div>
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
/* eslint-disable */
import BaseButton from "@/components/UI/BaseButton.vue";
export default {
  name: "ResponseComp",
  components: { BaseButton },
  props: ["executive", "date", "duration", "dateTimeHeader"],
  data() {
    return {
      isAddTimeSlot: false,
      isAccept: false,
      isDecline: false,
      timeSlots: [],
      selectTimeSlots: [],
      timeSlot: {
        from: null,
        to: null,
      },
      tempAnswer: "",
      form: {
        date: null,
        status: null,
        preferredTime: [],
      },
      errors: {},
      executiveId: null,
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
    IntervalTimeIsValid() {
      return this.timeSlot.from < this.timeSlot.to;
    },
    durationTimeIsValid() {
      var minDuration = this.duration * 60;
      var fromTime = this.timeSlot.from.split(/[- :]/);
      var toTime = this.timeSlot.to.split(/[- :]/);
      var fromDate = new Date();
      var toDate = new Date();
      fromDate.setHours(fromTime[0], fromTime[1], 0);
      toDate.setHours(toTime[0], toTime[1], 0);
      return (toDate.getTime() - fromDate.getTime()) / 60000 == minDuration;
    },
    getOverlaps() {
      if (this.selectTimeSlots.length > 0) {
        this.selectTimeSlots.sort((a, b) => {
          return this.getDateObj(a.from) - this.getDateObj(b.from);
        });
        for (var i = 0, l = this.selectTimeSlots.length; i < l; i++) {
          var oEvent = this.selectTimeSlots[i];
          var nOverlaps = 0;
          var oCompareEvent = {
            from: this.timeSlot.from,
            to: this.timeSlot.to,
          };
          if (
            (oCompareEvent.from <= oEvent.to &&
              oCompareEvent.to > oEvent.from) ||
            (oCompareEvent.to <= oEvent.from && oCompareEvent.from > oEvent.to)
          ) {
            nOverlaps++;
            return false;
          }
        }
      }
      return true;
    },
  },
  methods: {
    triggerFillToTime() {
      var bits = this.timeSlot.from.split(/[- :]/);
      var date = new Date();
      date.setHours(bits[0], bits[1], 0);
      var minuteDuration = this.duration * 60;
      var endTimeHour;
      var endTimeMinute;
      var endTime;
      if (minuteDuration % 60 != 0) {
        endTimeMinute = ((date.getMinutes() + minuteDuration) % 60).toString().padStart(2, "0");
        endTimeHour =
          date.getHours() +
            Math.floor((date.getMinutes() + minuteDuration) / 60) <
          12
            ? `${
                date.getHours() +
                Math.floor((date.getMinutes() + minuteDuration) / 60)
              }`.padStart(2, "0")
            : `${
                date.getHours() +
                Math.floor((date.getMinutes() + minuteDuration) / 60)
              }`;
      } else {
        endTimeMinute = date.getMinutes().toString().padStart(2, "0");
        endTimeHour =
          date.getHours() + this.duration < 12
            ? `${date.getHours() + this.duration}`.padStart(2, "0")
            : `${date.getHours() + this.duration}`;
      }
      endTime = `${endTimeHour}:${endTimeMinute}`;
      this.timeSlot.to = endTime;
    },
    getDateObj(a) {
      var bits = a.split(/[- :]/);
      var date = new Date();
      date.setHours(bits[0], bits[1], 0);
      return date.getHours() + ":" + date.getMinutes();
    },
    handleAccept(id) {
      this.isDecline = false;
      this.isAccept = true;
      this.form.date = this.date;
      this.form.status = "accepted";
      this.executiveId = id;
    },
    handleDecline(id) {
      this.isDecline = true;
      this.isAccept = false;
      this.timeSlots = [];
      this.form.status = "declined";
      this.form.preferredTime = [];
      this.form.date = this.date;
      this.executiveId = id;
      this.confirmResponse();
    },
    confirmResponse() {
      if (this.tempAnswer == "") {
        this.tempAnswer = this.form.status;
        this.$emit("onResponse", {
          executiveId: this.executiveId,
          timeSlot: [this.form],
        });
      } else {
        if (this.tempAnswer == "decline" || this.tempAnswer != "accept") {
          return;
        } else {
          this.tempAnswer = this.form.status;
          this.$emit("onResponse", {
            executiveId: this.executiveId,
            timeSlot: [this.form],
          });
        }
      }
    },
    handleAddTimeSlot() {
      this.isAddTimeSlot = true;
      this.form.date = this.date;
      this.selectTimeSlots = this.timeSlots;
      this.form.preferredTime = this.selectTimeSlots;
    },
    handleCloseTimeSlot() {
      this.selectTimeSlots = [];
      this.isAddTimeSlot = false;
    },
    handleConfirm() {
      this.timeSlots = [...this.selectTimeSlots];
      this.selectTimeSlots = [];
      this.isAddTimeSlot = false;
      this.confirmResponse();
      this.timeSlot.from = null;
      this.timeSlot.to = null;
      this.errors = {};
    },
    selectInbox(id) {
      this.selectedInbox = this.toBeConfirmedList.find((toBeConfirmed) => {
        this.selectedId = id;
        return toBeConfirmed.id == id;
      });
    },
    addTimeSlot() {
      this.fromTimeIsValid
        ? (delete this.errors.from, this.IntervalTimeIsValid)
          ? delete this.errors.interval
          : (this.errors.interval = "NOT be greater than end time")
        : (this.errors.from = "Please choose");
      this.getOverlaps
        ? delete this.errors.overlap
        : (this.errors.overlap = "This time is overlapping");
      this.durationTimeIsValid
        ? delete this.errors.duration
        : (this.errors.duration = "The duration of time is not correct");
      if (Object.keys(this.errors).length == 0) {
        var selectedTime = {
          from: this.timeSlot.from,
          to: this.timeSlot.to,
        };
        this.selectTimeSlots.push(selectedTime);
        // this.timeSlots.push(selectedTime);
        this.timeSlot.from = "";
        this.timeSlot.to = "";
      }
    },
    deleteTimeSlot(index) {
      this.selectTimeSlots.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.readonly {background-color: $grey !important;}
.modal {width: 100%;height: 100vh;position: fixed;background-color: rgba(24, 24, 26, 0.4);z-index: 11;display: flex;flex-direction: column;align-items: center;justify-content: center;}
.pop-up {top: 50%;left: 50%;transform: translate(-50%, -50%);position: fixed;z-index: 12;border-radius: 2.5rem;display: flex;flex-direction: column;background-color: $white;width: 80rem;padding: 2.4rem;animation-name: appears;animation-duration: 0.5s;animation-iteration-count: 1;.required {color: $error;margin-left: 0.2rem;font-size: 1.4rem !important;}.error-container {width: 100%;padding: 1rem 2rem;border-radius: 1rem;background-color: $error;color: $white !important;margin-bottom: 1.8rem;text-align: center;}.confirm-button {display: flex;justify-content: flex-end;}.time-slots {display: flex;flex-direction: column;row-gap: 1rem;height: 24rem;overflow: scroll;margin-bottom: 1rem;.time-slot {width: 100%;height: auto;padding: 1.2rem 3.2rem;background-color: $fadedViolet;border-radius: 1rem;.row {display: flex;justify-content: space-between;align-items: center;.column {display: flex;flex-direction: column;row-gap: 0.5rem;.bold-small-text {color: $darkViolet;}.small-text {color: $white;}}}}}.title {color: $primaryViolet;}.duration {margin-top: 1rem;color: $darkViolet;.duration-label {background-color: $yellow;color: $fakeDark;border-radius: 1rem;padding: 0.5rem 1.75rem;margin-left: 1rem;font-weight: 600;}}.form {display: flex;justify-content: space-around;column-gap: 1rem;align-items: flex-end;margin: 2rem 0;.input-form {width: 100%;display: flex;flex-direction: column;.gray-format {color: $darkGrey;font-weight: 400;}}select,input {margin-top: 1rem;padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input:focus {outline: none;border: 0.1rem solid $primaryViolet;}select::placeholder,input::placeholder {font-size: 1.4rem;color: $darkGrey;}select {font-size: 1.4rem;}select:focus {outline: none;border: 0.1rem solid $primaryViolet;}}}
.executive-response {margin: 1rem 0;display: flex;justify-content: space-between;align-items: center;span.desktop {color: $primaryViolet;}span.mobile {display: none;color: $primaryViolet;}}
.buttons {display: flex;column-gap: 0.5rem;}
.add-time-slot {display: flex;flex-direction: column;justify-content: flex-start;.label-text {margin-bottom: 1rem;}.bold-smallest-text {color: $darkGrey;}.show-time-slot {width: fit-content;border: 1px solid $darkViolet;padding: 1.2rem 1.8rem;border-radius: 0.5rem;margin: 0.25rem 0;.bold-smallest-text {color: $darkViolet !important;}}}
@media (max-width: 26.75em) {.pop-up {row-gap: 1rem;width: 90%;.form {flex-wrap: wrap;justify-content: flex-end;row-gap: 1.6rem;}}.executive-response {.executive-name {font-size: 2rem;}span.desktop {display: none;}span.mobile {display: inline;}}.add-time-slot {.bold-smallest-text {font-size: 1.6rem;}.show-time-slot {padding: 1.8rem 2.4rem;margin: 0.75rem 0;.bold-smallest-text {font-size: 1.8rem;}}}}
</style>