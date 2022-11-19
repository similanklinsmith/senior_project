<template>
  <div class="home">
    <BaseHeader
      :headerText="`${text['home']['header']}`"
      :contentText="`${text['home']['subHeader']}`"
    >
    </BaseHeader>
    <div class="body">
      <div class="mention">
        <div class="welcome">
          <div class="say-hi">
            {{text['home']['greeting']}}, <span v-if="getterMyProfile">{{ getterMyProfile.name }}</span>
          </div>
          <div class="num-mention">{{text['home']['preNumMeeting']}} {{ notificationMeeting.length }} {{text['home']['postNumMeeting']}}</div>
        </div>
        <div class="profile-image" v-if="$store.state.myProfilePic">
          <img
            :src="$store.state.myProfilePic"
            alt="profile of user"
            @error="
              $event.target.src =
                'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
            "
          />
        </div>
        <div class="default-image" v-else>
          <img
            src="@/assets/decorations/sample_profile.png"
            alt="sample profile illustration"
          />
        </div>
      </div>
      <div class="first-body-section grid">
          <div class="create-meeting-card">
            <div class="remark-text">{{text['home']['startMeeting']}}</div>
            <div class="card">
              <div class="image">
                <img
                  src="@/assets/decorations/create_meetings.png"
                  alt="create meeting illustration"
                />
              </div>
              <div class="card-content">
                <div class="remark-text">
                  {{text['home']['letCreateMeeting']}}
                </div>
                <BaseButton
                  class="mobile-button"
                  buttonType="common-button"
                  :btnText="text['home']['createMeeting']"
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
          <div class="executives-card">
            <div class="remark-text">{{text['home']['executives']}}</div>
            <div class="card">
              <div class="card-content">
                <div class="remark-text">{{text['home']['yourExecutive']}}</div>
                <div class="executives" v-if="getExecutivesList.length != 0">
                  <div
                    v-for="(executive, index) in getExecutivesList"
                    :key="executive.id"
                  >
                    <div
                      class="executive"
                      @click="navToShowExecutiveDetail(index)"
                    >
                      <div class="profile-section">
                        <div
                          class="real-profile-image"
                          v-if="executive.img_profile != 'default_profile.png'"
                        >
                          <img
                            :src="urlImage + '/' + executive.img_profile"
                            alt="sample profile illustration"
                            @error="
                              $event.target.src =
                                'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
                            "
                          />
                        </div>
                        <div class="profile-image" v-else>
                          <img
                            src="@/assets/decorations/sample_profile.png"
                            alt="sample profile illustration"
                          />
                        </div>
                        <div class="executive-profile">
                          <div class="name common-text">
                            {{ formatTitle(executive.title_code) }}
                            {{ executive.first_name }} {{ executive.last_name }}
                          </div>
                          <div class="position thin-content-text">
                            {{
                              formatPosition(executive.position)?.length > 30
                                ? formatPosition(executive.position).slice(
                                    0,
                                    31
                                  ) + "..."
                                : formatPosition(executive.position)
                            }}
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
                  {{text['home']['noExecutive']}}
                </div>
                <div class="executive-buttons">
                  <BaseButton
                    buttonType="common-button"
                    :btnText="text['home']['addExecutive']"
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
                    :btnText="text['home']['showExecutive']"
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
          <div class="calendar-card">
            <div class="remark-text">{{text['home']['calendar']}}</div>
            <div class="card">
              <vue-cal
                class="vuecal--date-picker vuecal--violet-theme"
                hide-view-selector
                :time="false"
                active-view="month"
                :disable-views="['week']"
                :events="getEvents"
                :selected-date="selectedDate"
              >
              </vue-cal>
            </div>
          </div>
      </div>
      <div class="second-body-section">
        <div class="title-section">
          <div class="remark-text">{{text['home']['incomingMeeting']}}</div>
          <div class="common-text" @click="$router.push({path: '/meetings-management'})">
            {{text['home']['seeAllMeeting']}}<i class="icon fa-solid fa-chevron-right"></i>
          </div>
        </div>
        <div class="incoming-meetings" v-if="getIncomingList.length > 0">
          <AttendeeGroup
            v-for="incoming in getIncomingList"
            :key="incoming.id"
            :id="incoming.id"
            :title="incoming.title"
            :startTime="incoming.meeting_start"
            :endTime="incoming.meeting_end"
            :date="incoming.meeting_date"
            :attendees="incoming.attendees"
            :location="incoming.location"
            :link="incoming.attached_link"
            :file="incoming.attached_file"
            @handleClick="navToMeetingDetail"
          />
        </div>
        <div v-else class="bold-content-text no-incoming-meetings">{{text['home']['noIncomingMeeting']}}</div>
        <div class="mobile-see remark-text">
          <BaseButton
            buttonType="common-button"
            :btnText="text['home']['seeAllMeeting']"
            textColor="#7452FF"
            textHover="white"
            color="#DBD2FF"
            hoverColor="#7452FF"
            height="100%"
            width="100%"
          >
            <template v-slot:after-icon>
              <i class="icon fa-solid fa-chevron-right"></i>
            </template>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseHeader from "@/components/UI/BaseHeader.vue";
import AttendeeGroup from "@/components/meeting/AttendeeGroup.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { BaseButton, BaseHeader, AttendeeGroup, VueCal },
  name: "HomeView",
  data() {
    return {
      text: null,
      lang: null,
      profileImage: null,
      urlImage: this.$store.state.imageURL,
      selectedDate: "",
    };
  },
  computed: {
    ...mapGetters([
      "getterMyExecutives",
      "getterLoadingStatus",
      "getterExecutiveTitles",
      "getterExecutivePositions",
      "getterMyIncomings",
      "getterMyInboxes",
      "getterMyProfile",
      "getterAllMeetings"
    ]),
    getExecutivesList() {
      return this.$store.getters.getterMyExecutives.slice(0, 2);
    },
    getIncomingList() {
      return this.$store.getters.getterMyIncomings;
    },
    getEvents() {
      let events=[];for(let index=0;index<this.$store.getters.getterAllMeetings.length;index++){var e=new Date(this.$store.getters.getterAllMeetings[index].start),t=new Date(e),n=10>t.getMinutes()?"0"+t.getMinutes():t.getMinutes(),s=new Date(this.$store.getters.getterAllMeetings[index].end),i=new Date(s),g=10>i.getMinutes()?"0"+i.getMinutes():i.getMinutes();events.push({start:this.$store.getters.getterAllMeetings[index].start.split("T")[0]+" "+t.getUTCHours()+":"+n,end:this.$store.getters.getterAllMeetings[index].end.split("T")[0]+" "+i.getUTCHours()+":"+g,title:this.$store.getters.getterAllMeetings[index].title,content:this.$store.getters.getterAllMeetings[index].meeting_detail})}
      return events;
    },
    notificationMeeting() {
      return this.getterMyInboxes.filter((inbox) => {
        return new Date(Date.now()) == new Date(inbox.create_at);
      });
    },
  },
  methods: {
    ...mapActions([
      "getMyExecutives",
      "getExecutiveTitle",
      "getExecutivePosition",
      "getProfileImage",
      "getMyIncoming",
      "getMyInboxes",
      "getMyProfile",
      "getAllMeetings"
    ]),
    changeLanguage() {
      this.lang = this.$cookies.set("lang", "th");
      window.location.reload()
    },
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
    },
    navToMeetingDetail(id) {
      this.$router.push({ path: `/meetings-inbox/inbox/${id}`, });
    },
    formatTitle(str) {
      return this.getterExecutiveTitles[str];
    },
    formatPosition(str) {
      return this.getterExecutivePositions[str];
    },
  },
  created() {
    this.getMyExecutives();
    this.getExecutiveTitle();
    this.getExecutivePosition();
    this.getProfileImage();
    this.getMyIncoming();
    this.getMyInboxes();
    this.getAllMeetings();
  },
  mounted() {
    window.scrollTo(0, 0);
    this.selectedDate = new Date().toISOString().slice(0, 10);
  },
  beforeMount() {
    if (this.$cookies.get("lang")) {
      this.lang = this.$cookies.get("lang");
    } else {
      this.lang = "en"
    }
    this.text = require(`@/assets/langs/${this.lang}.json`);
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.home {.badge {padding: 0.4rem 0.65rem;background-color: $highlightViolet;border-radius: 50%;display: inline-block;color: $white;position: relative;font-size: 1.2rem;font-weight: 600;}.body {padding: 3rem;.mention {display: none;color: $darkViolet;.profile-image, .default-image {width: 6.4rem;height: 6.4rem;background-color: $fadedViolet;border-radius: 0.5rem;overflow: hidden;}.default-image { padding: 0.2rem ;}.welcome {display: flex;flex-direction: column;row-gap: 1.6rem;.say-hi {font-size: 2.8rem;font-weight: 600;color: $primaryViolet;}.num-mention {font-size: 2rem;}}}.first-body-section {margin-bottom: 2rem;grid-template-columns: 0.65fr 1.25fr 1.15fr;column-gap: 3rem;.remark-text {color: var(--outsideText);}.executives-card,.create-meeting-card,.calendar-card {height: 50rem;width: 100%;position: relative;animation-name: appearsBottom;animation-duration: 0.75s;animation-iteration-count: 1;}.create-meeting-card {.card {margin-top: 3.6rem;position: relative;height: 38rem;background-color: $yellow;border-radius: 2.5rem;display: flex;flex-direction: column;align-items: center;.image {transform: translateY(-3.6rem);img {height: auto;width: 17.5rem;}}.card-content {text-align: center;padding: 0 3.6rem 6.4rem 3.6rem;.remark-text {color: $darkViolet;margin-bottom: 3rem;}}}}.executives-card {.remark-text {text-align: left;}.executive-buttons {display: flex;gap: 1.2rem;}.card {margin-top: 3.6rem;position: relative;height: 38rem;width: 100%;background-color: $white;border-radius: 2.5rem;.card-content {height: 100%;text-align: center;padding: 3.6rem;display: flex;flex-direction: column;justify-content: space-between;.remark-text {color: $darkViolet;}.no-executive {display: flex;flex-direction: column;height: 20rem;align-items: center;justify-content: center;color: $darkGrey;}.executives {display: flex;flex-direction: column;.line {width: 100%;height: 0.1rem;background-color: $grey;}.executive {margin: 2.5rem 0;cursor: pointer;display: flex;align-content: space-between;align-items: center;.profile-section {display: flex;width: 100%;.real-profile-image {border-radius: 1rem;width: 5rem;height: 5rem;overflow: hidden;margin-right: 1rem;img {width: 100%;height: 100%;object-fit: cover;}}.profile-image {display: flex;align-items: center;justify-content: center;border-radius: 1rem;width: 5rem;height: 5rem;background-color: $fadedViolet;margin-right: 1rem;img {width: 4.4rem;height: 4.4rem;}}.executive-profile {display: flex;flex-direction: column;justify-content: space-around;text-align: left;row-gap: 0.6rem;.name {color: $darkViolet;transition: 0.3s all ease-in-out;line-height: 1.2;}.position {color: $highlightViolet;}}}.arrow-button {display: flex;justify-content: center;align-items: center;width: 2.8rem;height: 2.8rem;border-radius: 5rem;background-color: $yellow;transition: 0.3s all ease-in-out;.icon {color: $white;font-size: 1.2rem;}}}.executive:hover {.executive-profile {.name {color: $primaryViolet;}}.arrow-button {transform: translateX(0.8rem);background-color: $primaryViolet;}}}}}}.calendar-card {.card {overflow: hidden;margin-top: 3.6rem;position: relative;height: 38rem;width: 100%;background-color: $white;border-radius: 2.5rem;}}}.second-body-section {display: flex;flex-direction: column;.mobile-see {display: none;}.title-section {margin-bottom: 3rem;display: flex;justify-content: space-between;.remark-text {color: var(--outsideText);}.common-text {cursor: pointer;color: $primaryViolet;transition: 0.2s all ease-in-out;.icon {padding-left: 1rem;color: $primaryViolet;font-size: 1.2rem;}}.common-text:hover {transform: translateX(-1.2rem);}}.incoming-meetings {display: flex;flex-direction: column;}.no-incoming-meetings {margin-bottom: 2rem;display: flex; align-items: center; justify-content: center; width:100%; height: 14rem;background-color: $white; border-radius: 1.8rem; padding: 2rem 0;text-align: center;color: $fadedViolet;}}}}
@media (max-width: 70em) {.home {.body {.first-body-section {column-gap: 2rem;.create-meeting-card {.card {.card-content {padding: 0 1.2rem 4.4rem 1.2rem;}}}.executives-card {.card {.card-content {padding: 2.4rem;}}}}}}}
@media (max-width: 63.5em) {.home {.body {.first-body-section {grid-template-columns: repeat(5, 1fr);column-gap: 3rem;.create-meeting-card {grid-column: span 2;.card {.card-content {padding: 0 3.2rem 5.4rem 3.2rem;}}}.executives-card {grid-column: span 3;.card {.card-content {padding: 2.4rem;}}}.calendar-card {margin-bottom: 3.6rem;order: 1;grid-column: span 5;.card {height: 45rem;}}}}}}
@media (max-width: 26.75em) {.home {.body {.mention {display: flex;margin-bottom: 6.4rem;background-color: $white;border-radius: 1rem;padding: 3.6rem 3.2rem;justify-content: space-between;box-shadow: rgb(0 0 0 / 4%) 0px 3px 5px;}.first-body-section {display: flex;overflow-x: scroll;column-gap: 3rem;.create-meeting-card {min-width: 90%;.card {display: grid;grid-template-rows: repeat(2, 1fr);width: 100%;height: 45rem;box-shadow: rgb(0 0 0 / 4%) 0px 3px 5px;.image {display: flex;justify-content: center;img {width: 26rem;}}.card-content {padding: 0 8rem 5.4rem 8rem;}}}.executives-card {min-width: 90%;.executive-buttons {display: grid;grid-template-rows: 1fr;}.card {height: 45rem;box-shadow: rgb(0 0 0 / 4%) 0px 3px 5px;.card-content {padding: 4.4rem;}}}.calendar-card {min-width: 90%;.card {height: 45rem;box-shadow: rgb(0 0 0 / 4%) 0px 3px 5px;}}}.second-body-section {.title-section {.common-text {display: none;}}.mobile-see {display: flex;flex-direction: column;justify-content: center;align-items: center;row-gap: 1rem;color: $primaryViolet;}}}}}
</style>
