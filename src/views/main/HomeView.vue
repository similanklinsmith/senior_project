<template>
  <div class="home">
    <BaseHeader
      :headerText="`Remaining Meetings`"
      :contentText="`This screen show overall of meeting and the executives who you take a responsibility.`"
    >
    </BaseHeader>
    <div class="body">
      <div class="first-body-section grid">
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
                hoverColor="#7452FF"
              >
                <template v-slot:after-icon>
                  <i class="icon fa-solid fa-plus"></i>
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
        <div class="executives-card">
          <div class="remark-text">Executives</div>
          <div class="card">
            <div class="card-content">
              <div class="remark-text">Your Executives</div>
              <div class="executives">
                <div class="executive">
                  <div class="profile-section">
                    <div class="profile-image">
                      <img
                        src="../../assets/decorations/sample_profile.png"
                        alt="sample profile illustration"
                      />
                    </div>
                    <div class="executive-profile">
                      <div class="name common-text">Name Surname</div>
                      <div class="position thin-content-text">position</div>
                    </div>
                  </div>
                  <div class="arrow-button">
                    <i class="icon fa-solid fa-chevron-right"></i>
                  </div>
                </div>
                <div class="line" />
                <div class="executive">
                  <div class="profile-section">
                    <div class="profile-image">
                      <img
                        src="../../assets/decorations/sample_profile.png"
                        alt="sample profile illustration"
                      />
                    </div>
                    <div class="executive-profile">
                      <div class="name common-text">Name Surname</div>
                      <div class="position thin-content-text">position</div>
                    </div>
                  </div>
                  <div class="arrow-button">
                    <i class="icon fa-solid fa-chevron-right"></i>
                  </div>
                </div>
              </div>
              <div style="display: flex; gap: 1.2rem; margin-top: 1.2rem">
                <BaseButton
                  buttonType="common-button"
                  btnText="Add executive"
                  textColor="white"
                  textHover="white"
                  color="#7452FF"
                  hoverColor="#23106D"
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
                >
                  <template v-slot:after-icon>
                    <div class="badge">
                      <div class="bold-smallest-text">3</div>
                    </div>
                  </template>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        <div class="executives-card">
          <div class="remark-text">Calendar</div>
          <div class="card"></div>
        </div>
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
export default {
  components: { BaseButton, BaseHeader, AttendeeGroup },
  name: "HomeView",
};
</script>
<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.home {
  .badge {
    padding: 0.6rem 0.8rem;
    background-color: $error;
    border-radius: 50%;
    display: inline-block;
    color: $white;
    position: relative;
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
      .create-meeting-card {
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
                    .name {
                      color: $darkViolet;
                      transition: 0.3s all ease-in-out;
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
