<template>
  <div class="meeting">
    <div class="mobile-meeting-card">
      <div class="first-section">
        <div class="remark-text">Meeting/Conference name</div>
        <div class="date-time">
          <div class="time">
            <i class="icon fa-regular fa-clock"></i>10:30 - 12:30
          </div>
          <div class="date">
            <i class="icon fa-regular fa-calendar"></i>Mon 21 March, 2022
          </div>
        </div>
        <div class="attendees">
          <div
            class="attendee"
            v-for="(attendee, index) in 5"
            :key="index"
          ></div>
        </div>
      </div>
      <div class="second-section">
        <div class="location common-text">
          <i class="icon fa-solid fa-location-dot"></i
          ><span>Microsoft Teams</span>
        </div>
        <div class="attachments">
          <div class="file"><i class="icon fa-regular fa-file"></i></div>
          <div class="link"><i class="icon fa-solid fa-link"></i></div>
        </div>
      </div>
    </div>
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
            <i class="icon fa-regular fa-file"></i
            ><span class="attached-file">attached file</span>
          </div>
          <div class="small-text">
            <i class="icon fa-solid fa-link"></i
            ><span class="attached-link">attached link</span>
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
@import "@/assets/colors/webColors.scss";
.meeting{display:flex;width:100%;padding:2.4rem 3.2rem;border-radius:2rem;background-color:$white;justify-content:space-between;align-items:center;margin-bottom:2rem;position:relative}
.mobile-meeting-card {display: none;}
.btnAction{cursor: pointer;color: $yellow;transition: 0.2s all ease-in-out;.icon {font-size: 1.8rem;margin-left: 1rem;transition: 0.2s all ease-in-out;}}
.btnAction:hover{color: $primaryViolet;.icon{color: $primaryViolet;}}
.meeting-card{display: flex;width: 80%;.display-day {width: fit-content;padding: 1.8rem;border-radius: 1.5rem;background-color: $primaryViolet;color: $white;row-gap: 0.4rem;margin-right: 1.5rem;}.time {margin-left: 1.5rem;row-gap: 1.6rem;align-items: start !important;.common-text {color: $darkViolet;}.content-text {color: $primaryViolet;.icon {font-size: 1.4rem;margin-right: 1rem;}}}.line{margin: 0 5rem;height: auto;width: 0.1rem;background-color: $grey;}.meeting-detail{display: flex;flex-direction: column;justify-content: center;.bold-content-text{margin-bottom: 2rem;}.additional-detail{display: flex;color: $darkViolet;align-items: center;column-gap: 5rem;.icon{margin-right: 1rem;color: $primaryViolet;}.attendees{display: flex;align-items: center;.icon{font-size: 1.4rem;margin-right: 1rem;color: $primaryViolet;}.attendee-img{display: flex;padding-top: 0.2rem;padding-bottom: 0.2rem;padding-left: 0.4rem;border-radius: 5rem;background-color: $fadedViolet;.attendee{width: 2.4rem;height: 2.4rem;border-radius: 50%;background-color: $primaryViolet;margin-right: -0.8rem;display: flex;justify-content: center;align-items: center;}}}}}}
@media (max-width: 63.5em) {
  .meeting {
    padding: 1.4rem 2.2rem;
    margin-bottom: 1.8rem;
  }
  .meeting-card {
    .time {
      margin-left: 0rem;
    }
    .line {
      margin: 0 3rem;
    }
    .meeting-detail {
      .additional-detail {
        column-gap: 1.5rem;
        .icon {
          margin-right: 0.6rem;
        }
      }
    }
  }
}

@media (max-width: 48em) {
  .meeting-card {
    width: 85%;
    .line {
      margin: 0 2rem;
    }
  }
}
@media (max-width: 40rem) {
  .meeting-card {
    .meeting-detail {
      .additional-detail {
        .attached-file,
        .attached-link {
          display: none;
        }
      }
    }
  }
}
@media (max-width: 26.75em) {
  .mobile-meeting-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    .first-section {
      padding: 4rem 4.8rem;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      row-gap: 2.4rem;
      border-bottom: 1px solid $darkGrey;
      .date-time {
        display: flex;
        column-gap: 3.2rem;
        color: $primaryViolet;
        .date,
        .time {
          font-size: 2rem;
          .icon {
            margin-right: 1rem;
          }
        }
      }
      .attendees {
        display: flex;
        column-gap: 2rem;
        .attendee {
          width: 6.4rem;
          height: 6.4rem;
          border-radius: 0.5rem;
          background-color: $fadedViolet;
        }
      }
    }
    .second-section {
      padding: 3.6rem 4.8rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .location {
        color: $primaryViolet;
        .icon {
          margin-right: 1rem;
          font-size: 2rem;
        }
        span {
          color: $highlightViolet;
        }
      }
      .attachments {
        display: flex;
        column-gap: 4rem;
        .file,
        .link {
          font-size: 2rem;
          background-color: $yellow;
          padding: 2rem;
          border-radius: 50%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon {
            position: absolute;
            color: $white;
          }
        }
      }
    }
  }
  .meeting {
    padding: 0;
    overflow: hidden;
    margin-bottom: 2.8rem;
  }
  .meeting-card {
    display: none;
  }
  .btnAction {
    display: none;
  }
}
@media (max-width: 21.75em) {
  .mobile-meeting-card {
    .first-section {
      padding: 4rem 3.6rem;
    }
    .second-section {
      padding: 3.6rem 3.6rem;
    }
  }
}
</style>
