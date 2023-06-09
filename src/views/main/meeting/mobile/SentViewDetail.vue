<template>
  <div v-if="!isLoading && inboxDetail != null">
    <MaskMeetingDetailMobile
      :title="inboxDetail.title"
      :dateTime="inboxDetail.create_at"
      :type="type"
      :sender="''"
    >
      {{ inboxDetail }}
      <template v-slot:detail-slot>
        <div class="expired-date">
          <span>*</span>{{text['sent']['expiredForm']}}
          {{ inboxDetail.due_date_time.split("T")[0] }}
          <span
            >({{ calculateRemainingDay(inboxDetail.due_date_time) }} {{text['sent']['postDueDate']}})</span
          >
        </div>
        <div class="timeSlot-label">{{text['sent']['timeslots']}}</div>
        <div class="timeSlot">
          <div class="label-header">
            <i class="fa-regular fa-calendar"></i>
            <i class="fa-regular fa-clock"></i>
          </div>
          <div class="detail">
            <div>
              {{text['sent']['from']}} {{ inboxDetail.start_date.split("T")[0] }} {{text['sent']['to']}}
              {{ inboxDetail.end_date.split("T")[0] }}
            </div>
            <div>
              {{ inboxDetail.duration_of_time.toString().split(".")[0] }}{{text['sent']['hour']}}
              <span v-if="inboxDetail.duration_of_time.toString().split('.')[1]"
                >{{
                  inboxDetail.duration_of_time.toString().split(".")[1] * 6
                }}{{text['sent']['min']}}</span
              >
            </div>
          </div>
        </div>
        <div class="attendees-label">{{text['sent']['attendees']}}</div>
        <div class="attendees" @click="showAllAttendee">
          <div
            class="attendee"
            v-for="attendee in inboxDetail.attendees.slice(0, 5)"
            :key="attendee"
          >
            <div
              class="profile-image"
              v-if="attendee.executive.img_profile == 'default_profile.png'"
            >
              <img
                src="@/assets/decorations/sample_profile.png"
                alt="sample profile illustration"
              />
            </div>
            <div class="real-profile-image" v-else>
              <img
                :src="urlImage + '/' + attendee.executive.img_profile"
                alt="sample profile illustration"
                @error="
                  $event.target.src =
                    'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
                "
              />
            </div>
          </div>
          <div v-if="inboxDetail.attendees.length > 5" class="attendee-more">
            <div class="remark-text">
              +{{ inboxDetail.attendees.length - 5 }}
            </div>
          </div>
        </div>
        <div
          class="button"
          v-if="new Date(inboxDetail.due_date_time) >= new Date()"
        >
          <BaseButton
            buttonType="common-button"
            :btnText="text['sent']['deletePoll']"
            textColor="white"
            textHover="white"
            color="#F33C3C"
            hoverColor="#d93333"
            width="fit-content"
            @click="isShowPopup = true"
          />
        </div>
        <BaseAttendeesPopup
          :attendees="inboxDetail.attendees"
          :isShowAttendees="isShowAttendees"
          @onClosePopup="isShowAttendees = false"
        />
      </template>
    </MaskMeetingDetailMobile>
    <BasePopup
      v-if="isShowPopup"
      @closeModal="isShowPopup = false"
      :image="require(`@/assets/decorations/delete_executive.png`)"
    >
      <template v-slot:popupContent>
        {{text['sent']['prePopupText']}}(<span :style="{ color: '#C4C4C4 !important' }">{{
          inboxDetail.title
        }}</span
        >) {{text['sent']['postPopupText']}}
      </template>
      <template v-slot:buttons>
        <BaseButton
          buttonType="common-button"
          :btnText="text['sent']['confirmDelete']"
          textColor="white"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="deletePollAppointment(inboxDetail.id)"
        >
        </BaseButton>
        <BaseButton
          buttonType="outlined-button"
          :btnText="text['sent']['cancel']"
          textColor="#F33C3C"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="isShowPopup = false"
        >
        </BaseButton>
      </template>
    </BasePopup>
  </div>
  <BaseNotFound v-else :isFailed="isFailed" />
</template>

<script>
import MaskMeetingDetailMobile from "@/components/meeting/MaskMeetingDetailMobile.vue";
import BaseAttendeesPopup from "@/components/UI/BaseAttendeesPopup.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseNotFound from "@/components/UI/BaseNotFound.vue";
import BasePopup from "@/components/UI/BasePopup.vue";
import { useRoute } from "vue-router";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SentViewDetail",
  components: {
    MaskMeetingDetailMobile,
    BaseAttendeesPopup,
    BaseButton,
    BaseNotFound,
    BasePopup,
  },
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const type = route.params.type;
    return { id, type };
  },
  data() {
    return {
      text: null,
      lang: null,
      isFailed: false,
      inboxDetail: null,
      isLoading: false,
      urlImage: this.$store.state.imageURL,
      searchInput: "",
      isShowAttendees: false,
      isShowPopup: false,
    };
  },
  computed: {
    ...mapGetters(["getterMyPollDetail"]),
  },
  methods: {
    ...mapActions(["getMyPollDetail"]),
    async getPollDetail() {
        this.inboxDetail = await this.$store.dispatch(
          "getMyPollDetail",
          this.id
        );
        this.inboxDetail == null ? this.isFailed = true : this.isFailed = false;
        this.isLoading = false;
    },
    async deletePollAppointment(id) {
      await this.$store.dispatch("deletePollAppointment", id);
      this.isShowPopup = false;
      this.inboxDetail = null;
      this.$router.push({ path: "/meetings-management" });
    },
    calculateRemainingDay(date) {
      return Math.round(
        (new Date(date) - new Date(Date.now())) / (24 * 60 * 60 * 1000)
      ) < 0
        ? 0
        : Math.round(
            (new Date(date) - new Date(Date.now())) / (24 * 60 * 60 * 1000)
          );
    },
    showAllAttendee() {
      this.isShowAttendees = !this.isShowAttendees;
    },
    copyLink(value) {
      let copyText = document.getElementById(value).innerHTML;
      navigator.clipboard.writeText(copyText);
    },
  },
  mounted() {
    this.getPollDetail();
  },
  beforeMount() {
    if (this.$cookies.get("lang")) {
      this.lang = this.$cookies.get("lang");
    } else {
      this.lang = "en";
    }
    this.text = require(`@/assets/langs/${this.lang}.json`);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.loading {
  height: 100vh;
  color: $highlightViolet;
  animation-name: floating;
  -webkit-animation-name: floating;
  animation-duration: 3s;
  -webkit-animation-duration: 3s;
  animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
}
.timeSlot-label,
.attendees-label {
  color: $darkGrey;
  font-size: 1.8rem;
  margin-top: 2rem;
}
.timeSlot {
  display: grid;
  grid-template-columns: 0.08fr 0.92fr;
  .label-header,
  .detail {
    display: flex;
    flex-direction: column;
    row-gap: 2.4rem;
    width: fit-content;
    color: $primaryViolet;
    font-size: 2rem;
  }
}
.attendees {
  display: flex;
  column-gap: 2rem;
  .profile-image {
    border-radius: 1rem;
    width: 6rem;
    height: 6rem;
    background-color: $fadedViolet;
    padding: 0.8rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .real-profile-image {
    border-radius: 1rem;
    width: 6rem;
    height: 6rem;
    background-color: $fadedViolet;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .attendee,
  .attendee-more {
    width: 6rem;
    height: 6rem;
    border-radius: 0.5rem;
    background-color: $fadedViolet;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .attendee-more {
    background-color: $grey;
    color: $primaryViolet;
  }
}
.description {
  display: grid;
  grid-template-columns: 0.08fr 0.92fr;
  font-size: 2rem;
  line-height: 1.6;
  margin: 2rem 0;
  .icon {
    color: $primaryViolet;
  }
  .description-content {
    height: 40rem;
    overflow: scroll;
  }
  .description-content::-webkit-scrollbar {
    display: block !important;
    -ms-overflow-style: auto !important;
    scrollbar-width: auto !important;
    background-color: transparent;
    width: 1.4rem;
  }
  .description-content::-webkit-scrollbar-track {
    margin: 1rem;
    border-radius: 0.5rem;
  }
  .description-content::-webkit-scrollbar-thumb {
    background-color: $grey;
    border-radius: 0.5rem;
    transition: all 0.2s ease-in-out;
  }
  .description-content::-webkit-scrollbar-thumb:hover {
    background-color: $darkGrey;
  }
}
.meeting-label,
.expired-date {
  font-size: 2rem;
  font-weight: 500;
  color: $primaryViolet;
  span {
    color: $error;
  }
}
.button {
  align-self: flex-end;
  margin: 1rem 0;
}
</style>
