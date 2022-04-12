<template>
  <div class="meeting">
    <div class="meeting-card">
      <div class="display-day flex-col-center">
        <div class="month content-text">March</div>
        <div class="date header-text">21</div>
      </div>
      <div class="time flex-col-center">
        <div class="common-text">start-end time</div>
        <div class="content-text">
          <i class="icon fa-regular fa-clock"></i>10:30 - 12:30
        </div>
      </div>
      <div class="line" />
      <div class="meeting-detail">
        <div class="bold-content-text">Meeting/Conference name</div>
        <div class="additional-detail">
          <div class="small-text">
            <i class="icon fa-regular fa-file"></i>attached link
          </div>
          <div class="small-text">
            <i class="icon fa-regular fa-file"></i>attached link
          </div>
          <div class="attendees">
            <i class="icon fa-regular fa-user"></i>
            <div class="attendee-img">
              <div
                v-for="(attendee, index) in 5"
                :key="index"
                class="attendee"
                :style="'background-color:' + colorsList[index] + ';'"
              >
                <div class="small-content" style="color: white">N</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btnAction" @click="btnAction">
      <div class="small-text">
        show details<i class="icon fa-solid fa-circle-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AttendeeGroup",
  data() {
    return {
      colorsList: ["#23106D", "#7452FF", "#DBD2FF", "#F4F4F4", "#FFCB57"],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.meeting {
  display: flex;
  width: 100%;
  padding: 2.4rem 3.2rem;
  border-radius: 2rem;
  background-color: $white;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.btnAction {
  cursor: pointer;
  color: $yellow;
  transition: 0.2s all ease-in-out;
  .icon {
    font-size: 1.8rem;
    margin-left: 1rem;
    transition: 0.2s all ease-in-out;
  }
}
.btnAction:hover {
  color: $primaryViolet;
  .icon {
    color: $primaryViolet;
  }
}
.meeting-card {
  display: flex;
  width: 80%;
  .display-day {
    width: fit-content;
    padding: 1.8rem;
    border-radius: 1.5rem;
    background-color: $primaryViolet;
    color: $white;
    row-gap: 0.4rem;
    margin-right: 1.5rem;
  }
  .time {
    margin-left: 1.5rem;
    row-gap: 1.6rem;
    .common-text {
      color: $darkViolet;
    }
    .content-text {
      color: $primaryViolet;
      .icon {
        font-size: 1.4rem;
        margin-right: 1rem;
      }
    }
  }
  .line {
    margin: 0 5rem;
    height: auto;
    width: 0.1rem;
    background-color: $grey;
  }
  .meeting-detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .bold-content-text {
      margin-bottom: 2rem;
    }
    .additional-detail {
      display: flex;
      color: $darkViolet;
      align-items: center;
      column-gap: 5rem;
      .icon {
        margin-right: 1rem;
        color: $primaryViolet;
      }
      .attendees {
        display: flex;
        align-items: center;

        .icon {
          font-size: 1.4rem;
          margin-right: 1rem;
          color: $primaryViolet;
        }
        .attendee-img {
          display: flex;
          padding-top: 0.2rem;
          padding-bottom: 0.2rem;
          padding-left: 0.4rem;
          border-radius: 5rem;
          background-color: $fadedViolet;
          .attendee {
            width: 2.4rem;
            height: 2.4rem;
            border-radius: 50%;
            background-color: $primaryViolet;
            margin-right: -0.8rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
