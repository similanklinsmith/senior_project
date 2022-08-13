<template>
  <MaskMeetingDetailMobile
    :title="`[Firebase] Client access to your Realtime Database 'flutter2-f80d0-
        default-rtdb is expiring soon`"
    :dateTime="'2022-05-15T07:40:32.000Z'"
    :type="type"
    :sender="'Katherine Perish'"
  >
    <template v-slot:detail-slot>
      <div class="expired-date">
        <span>*</span>This form will be expired in 2022-05-10
        <span>(3 days left)</span>
      </div>
      <div class="timeSlot-label">Timeslots</div>
      <div class="timeSlot">
        <div class="label-header">
          <i class="fa-regular fa-calendar"></i>
          <i class="fa-regular fa-clock"></i>
        </div>
        <div class="detail">
          <div>From 2022-05-15 to 2022-05-20</div>
          <div>2 hours</div>
        </div>
      </div>
      <div class="attendees-label">Attendees</div>
      <div class="attendees" @click="showAllAttendee">
        <div
          class="attendee"
          v-for="attendee in attendees.slice(0, 5)"
          :key="attendee"
        >
          <div
            class="profile-image"
            v-if="attendee.image == 'default_profile.png'"
          >
            <img
              src="@/assets/decorations/sample_profile.png"
              alt="sample profile illustration"
            />
          </div>
          <div class="real-profile-image" v-else>
            <img
              :src="urlImage + '/' + attendee.image"
              alt="sample profile illustration"
              @error="
                $event.target.src =
                  'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
              "
            />
          </div>
        </div>
        <div v-if="attendees.length > 5" class="attendee-more">
          <div class="remark-text">+{{ attendees.length - 5 }}</div>
        </div>
      </div>
      <!-- <div
          class="button"
          v-if="
            new Date(selectedInbox.due_date_time) >=
            new Date()
          "
        > -->
      <div class="button">
        <BaseButton
          buttonType="common-button"
          btnText="Delete Poll"
          textColor="white"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="fit-content"
          @click="isShowPopup = true"
        />
      </div>
      <BaseAttendeesPopup
        :attendees="attendees"
        :isShowAttendees="isShowAttendees"
        @onClosePopup="isShowAttendees = false"
      />
    </template>
  </MaskMeetingDetailMobile>
</template>

<script>
import MaskMeetingDetailMobile from "@/components/meeting/MaskMeetingDetailMobile.vue";
import BaseAttendeesPopup from "@/components/UI/BaseAttendeesPopup.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import { useRoute } from "vue-router";
export default {
  name: "SentViewDetail",
  components: { MaskMeetingDetailMobile, BaseAttendeesPopup, BaseButton },
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const type = route.params.type;
    return { id, type };
  },
  data() {
    return {
      urlImage: this.$store.state.imageURL,
      searchInput: "",
      isShowAttendees: false,
      attendees: [
        {
          id: 1,
          title: "Mr",
          firstname: "Similan",
          lastname: "Klinsmith",
          image: "default_profile.png",
        },
        {
          id: 2,
          title: "Ms",
          firstname: "Noparat",
          lastname: "Prasongdee",
          image: "default_profile.png",
        },
        {
          id: 3,
          title: "Ms",
          firstname: "Praepanwa",
          lastname: "Tedprasit",
          image: "default_profile.png",
        },
        {
          id: 4,
          title: "Ms",
          firstname: "Natcha",
          lastname: "Phannoi",
          image: "default_profile.png",
        },
        {
          id: 5,
          title: "Ms",
          firstname: "Nattakorn",
          lastname: "Lertsakornprasert",
          image: "default_profile.png",
        },
        {
          id: 6,
          title: "Mr",
          firstname: "Jiraphat",
          lastname: "Poolprapha",
          image: "default_profile.png",
        },
        {
          id: 7,
          title: "Ms",
          firstname: "Sunanta",
          lastname: "Sighka",
          image: "default_profile.png",
        },
      ],
    };
  },
  methods: {
    copyLink(value) {
      let copyText = document.getElementById(value).innerHTML;
      navigator.clipboard.writeText(copyText);
    },
    showAllAttendee() {
      this.isShowAttendees = true;
    },
  },
  mounted() {
    console.log(`This is params id: ${this.id}`);
    console.log(`This is params type: ${this.type}`);
    // GET by /:{type}/:{id}
    // Ex. /inbox/1
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
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
