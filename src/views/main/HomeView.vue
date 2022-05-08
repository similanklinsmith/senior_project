<template>
  <div class="home">
    <BaseHeader
      :headerText="`Remaining Meetings`"
      :contentText="`This screen show overall of meeting and the executives who you take a responsibility.`"
    >
    </BaseHeader>
    <div class="body">
      <div class="first-body-section grid">
        <transition name="slide" appear>
          <div class="create-meeting-card">
            <div class="remark-text">Start meetings</div>
            <div class="card">
              <div class="image">
                <img
                  src="../../assets/decorations/create_meetings.png"
                  alt="create meeting illustration"
                />
              </div>
              <div class="card-content">
                <div class="remark-text">
                  Let’s create meeting schedule right now!
                </div>
                <BaseButton
                  buttonType="common-button"
                  btnText="Create meeting"
                  textColor="#18181A"
                  textHover="white"
                  color="white"
                  width="100%"
                  hoverColor="#7452FF"
                  @onClick="navToCreateMeeting"
                >
                  <template v-slot:after-icon>
                    <i class="icon fa-solid fa-plus"></i>
                  </template>
                </BaseButton>
              </div>
            </div>
          </div>
        </transition>
        <transition name="slide" appear>
          <div class="executives-card">
            <div class="remark-text">Executives</div>
            <div class="card">
              <div class="card-content">
                <div class="remark-text">Your Executives</div>
                <div class="executives" v-if="getExecutivesList.length != 0">
                  <div
                    v-for="(executive, index) in getExecutivesList"
                    :key="executive.id"
                  >
                    <div class="executive" @click="navToShowExecutiveDetail(index)">
                      <div class="profile-section">
                        <div class="profile-image">
                          <img
                            src="../../assets/decorations/sample_profile.png"
                            alt="sample profile illustration"
                          />
                        </div>
                        <div class="executive-profile">
                          <div class="name common-text">
                            {{ executive.title_code }}.
                            {{ executive.first_name }} {{ executive.last_name }}
                          </div>
                          <div class="position thin-content-text">
                            {{ executive.position }}
                          </div>
                        </div>
                      </div>
                      <div class="arrow-button">
                        <i class="icon fa-solid fa-chevron-right"></i>
                      </div>
                    </div>
                    <div
                      v-if="index != getExecutivesList.length - 1"
                      class="line"
                    />
                  </div>
                </div>
                <div v-else class="no-executive bold-small-text">
                  There is not executive
                </div>
                <div style="display: flex; gap: 1.2rem; margin-top: 1.2rem">
                  <BaseButton
                    buttonType="common-button"
                    btnText="Add executive"
                    textColor="white"
                    textHover="white"
                    color="#7452FF"
                    hoverColor="#23106D"
                    height="100%"
                    width="100%"
                    @onClick="navToAddExecutive"
                  >
                    <template v-slot:after-icon>
                      <i class="icon fa-solid fa-user-plus"></i>
                    </template>
                    ></BaseButton
                  >
                  <BaseButton
                    buttonType="outlined-button"
                    btnText="Show all"
                    textColor="#7452FF"
                    textHover="white"
                    color="#7452FF"
                    hoverColor="#23106D"
                    height="100%"
                    width="100%"
                    @onClick="navToShowExecutive"
                  >
                    <template v-slot:after-icon>
                      <div class="badge">
                        <div>{{ getExecutivesList.length }}</div>
                      </div>
                    </template>
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <transition name="slide" appear>
          <div class="calendar-card">
            <div class="remark-text">Calendar</div>
            <div class="card">
              <vue-cal
                class="vuecal--date-picker vuecal--violet-theme"
                hide-view-selector
                :time="false"
                active-view="month"
                :disable-views="['week']"
                :events="events"
                :selected-date="selectedDate"
              >
              </vue-cal>
            </div>
          </div>
        </transition>
      </div>
      <div class="second-body-section">
        <div class="title-section">
          <div class="remark-text">Calendar</div>
          <div class="common-text">
            See all meetings<i class="icon fa-solid fa-chevron-right"></i>
          </div>
        </div>
        <div class="incoming-meetings">
          <AttendeeGroup></AttendeeGroup>
          <AttendeeGroup></AttendeeGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "../../components/UI/BaseButton.vue";
import BaseHeader from "../../components/UI/BaseHeader.vue";
import AttendeeGroup from "../../components/meeting/AttendeeGroup.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { BaseButton, BaseHeader, AttendeeGroup, VueCal },
  name: "HomeView",
  data() {
    return {
      selectedDate: "",
      events: [
        {
          start: "2022-05-03 10:35",
          end: "2022-05-03 11:30",
          title: "Doctor appointment",
          content: "Free Time 10:35 - 11:30",
        },
        {
          start: "2022-05-03 10:35",
          end: "2022-05-03 11:30",
          title: "Doctor appointment",
          content: "Free Time 10:35 - 11:30",
        },
        {
          start: "2022-05-22 10:00",
          end: "2022-05-22 15:00",
          title: "Doctor appointment",
          content: "Free Time 10:35 - 11:30",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getterMyExecutives", "getterLoadingStatus"]),
    getExecutivesList() {
      return this.$store.getters.getterMyExecutives.slice(0, 2);
    },
  },
  methods: {
    ...mapActions(["getMyExecutives"]),
    navToCreateMeeting() {
      localStorage.setItem("index", 1);
      this.$router.push({ path: "/meetings-management" });
    },
    navToAddExecutive() {
      this.$router.push({ name: "executive", params: { isAdd: true } });
    },
    navToShowExecutive() {
      this.$router.push({ name: "executive" });
    },
    navToShowExecutiveDetail(index) {
      this.$router.push({ name: "executive", params: { showIndex: index } });
    }
  },
  created() {
    this.getMyExecutives(1);
  },
  mounted() {
    this.selectedDate = new Date().toISOString().slice(0, 10);
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.home {
  .badge {
    padding: 0.3rem 0.5rem;
    background-color: $error;
    border-radius: 50%;
    display: inline-block;
    color: $white;
    position: relative;
    font-size: 1.2rem;
    font-weight: 600;
  }
  .body {
    padding: 3rem;
    .first-body-section {
      margin-bottom: 2rem;
      grid-template-columns: 0.65fr 1.25fr 1.15fr;
      column-gap: 3rem;
      .remark-text {
        color: $darkViolet;
      }
      .executives-card,
      .create-meeting-card,
      .calendar-card {
        height: 50rem;
        width: 100%;
        position: relative;
      }
      .create-meeting-card {
        .card {
          margin-top: 3.6rem;
          position: relative;
          height: 38rem;
          background-color: $yellow;
          border-radius: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          .image {
            transform: translateY(-3.6rem);
            img {
              width: 17.5rem;
            }
          }
          .card-content {
            text-align: center;
            padding: 0 3.6rem 6.4rem 3.6rem;
            .remark-text {
              margin-bottom: 3rem;
            }
          }
        }
      }
      .executives-card {
        .remark-text {
          text-align: left;
        }
        .card {
          margin-top: 3.6rem;
          position: relative;
          height: 38rem;
          width: 100%;
          background-color: $white;
          border-radius: 2.5rem;
          .card-content {
            text-align: center;
            padding: 3.6rem;
            .no-executive {
              display: flex;
              flex-direction: column;
              height: 20rem;
              align-items: center;
              justify-content: center;
              color: $darkGrey;
            }
            .executives {
              display: flex;
              flex-direction: column;
              .line {
                width: 100%;
                height: 0.1rem;
                background-color: $grey;
              }
              .executive {
                margin: 2.5rem 0;
                cursor: pointer;
                display: flex;
                align-content: space-between;
                align-items: center;
                .profile-section {
                  display: flex;
                  width: 100%;
                  .profile-image {
                    border-radius: 1rem;
                    width: 5rem;
                    height: 5rem;
                    background-color: $fadedViolet;
                    margin-right: 1rem;
                    img {
                      width: 4.4rem;
                      height: 4.4rem;
                    }
                  }
                  .executive-profile {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    text-align: left;
                    row-gap: 0.6rem;
                    .name {
                      color: $darkViolet;
                      transition: 0.3s all ease-in-out;
                      line-height: 1.2;
                    }
                    .position {
                      color: $highlightViolet;
                    }
                  }
                }
                .arrow-button {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 2.8rem;
                  height: 2.8rem;
                  border-radius: 5rem;
                  background-color: $yellow;
                  transition: 0.3s all ease-in-out;
                  .icon {
                    color: $white;
                    font-size: 1.2rem;
                  }
                }
              }
              .executive:hover {
                .executive-profile {
                  .name {
                    color: $primaryViolet;
                  }
                }
                .arrow-button {
                  transform: translateX(0.8rem);
                  background-color: $primaryViolet;
                }
              }
            }
          }
        }
      }
      .calendar-card {
        .card {
          overflow: hidden;
          margin-top: 3.6rem;
          position: relative;
          height: 38rem;
          width: 100%;
          background-color: $white;
          border-radius: 2.5rem;
        }
      }
    }
    .second-body-section {
      display: flex;
      flex-direction: column;
      .title-section {
        margin-bottom: 3rem;
        display: flex;
        justify-content: space-between;
        .remark-text {
          color: $darkViolet;
        }
        .common-text {
          cursor: pointer;
          color: $primaryViolet;
          transition: 0.2s all ease-in-out;
          .icon {
            padding-left: 1rem;
            color: $primaryViolet;
            font-size: 1.2rem;
          }
        }
        .common-text:hover {
          transform: translateX(-1.2rem);
        }
      }
      .incoming-meetings {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
