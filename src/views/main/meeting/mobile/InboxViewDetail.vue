<template>
  <MaskMeetingDetailMobile
    :title="`[Firebase] Client access to your Realtime Database 'flutter2-f80d0-
        default-rtdb is expiring soon`"
    :dateTime="'2022-05-15T07:40:32.000Z'"
    :type="type"
    :sender="'Katherine Perish'"
  >
    <template v-slot:detail-slot>
      <div class="main-details">
        <div class="label-header">
          <i class="fa-regular fa-calendar"></i>
          <i class="fa-regular fa-clock"></i>
          <i class="fa-solid fa-location-dot"></i>
          <i class="fa-regular fa-user"></i>
        </div>
        <div class="detail">
          <div>Thu April 11 2022 (11/04/2022)</div>
          <div>10:30 AM - 12:30 PM</div>
          <div>Microsoft Teams</div>
          <div>Miss Katherine Perish</div>
        </div>
      </div>
      <div class="attendees-label">Attendees</div>
      <div class="attendees" @click="isShowAttendees = true">
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
        <div class="attendee-more" v-if="attendees.length > 5">
          <div class="remark-text">+{{ attendees.length - 5 }}</div>
        </div>
      </div>
      <div class="description">
        <i class="fa-solid fa-align-left icon"></i>
        <div class="description-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisis
          integer senectus magna turpis. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Facilisis integer senectus magna turpis. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Facilisis integer senectus magna turpis.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Facilisis integer
          senectus magna turpis. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Facilisis integer senectus magna turpis. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.
        </div>
      </div>
      <div class="meeting-label">Meeting link</div>
      <div class="meeting-link" @click="copyLink('meeting-link-value')">
        <div class="meeting-link-text" id="meeting-link-value">
          www.teams.com/meeting/ASokp98e/Uid1112www.teams.com/meeting/ASokp98e/Uid1112ddddddd
        </div>
        <div class="copy-icon">
          <i class="icon fa-regular fa-copy"></i>
        </div>
      </div>
      <div class="attachment-file">
        <div class="attachment-file-label">Attachment File</div>
        <div class="attachment-download">
          <div class="file-section">
            <div class="first-section">
              <div class="file-icon">
                <i class="icon fa-solid fa-file"></i>
              </div>
              <div class="file-details">
                <div class="file-name">File_name.pdf</div>
                <div class="file-size">5.28KB</div>
              </div>
            </div>
            <div class="file-download">
              <i class="icon fa-solid fa-caret-down"></i>
            </div>
          </div>
        </div>
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
import { useRoute } from "vue-router";
export default {
  name: "InboxViewDetail",
  components: { MaskMeetingDetailMobile, BaseAttendeesPopup },
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
        {
          id: 8,
          title: "Ms",
          firstname: "Apisara",
          lastname: "Ngakor",
          image: "default_profile.png",
        },
        {
          id: 9,
          title: "Ms",
          firstname: "Nattanunkorn",
          lastname: "Boonsawat",
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
.date-time,
.attendees-label {
  color: $darkGrey;
  font-size: 1.8rem;
}
.main-details {
  display: grid;
  grid-template-columns: 0.08fr 0.92fr;
  margin: 2rem 0rem;
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
.meeting-label {
  font-size: 2rem;
  font-weight: 500;
  color: $primaryViolet;
}
.meeting-link {
  width: 100%;
  background-color: $primaryGrey;
  border-radius: 0.5rem;
  display: flex;
  padding: 2.8rem 1.8rem;
  align-items: center;
  position: relative;
  .copy-icon {
    width: 7.2rem;
    height: 100%;
    position: absolute;
    right: 0%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
  .icon {
    font-size: 2.4rem;
    color: $darkGrey;
  }
  .meeting-link-text {
    font-size: 2rem;
    color: $darkViolet;
    overflow-x: scroll;
  }
}
.attachment-file {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  font-size: 2rem;
  .attachment-file-label {
    font-weight: 500;
    color: $primaryViolet;
  }
  .attachment-download {
    width: 35rem;
    border-radius: 0.5rem;
    padding: 2rem 2.4rem;
    background-color: $primaryGrey;
    display: flex;
    row-gap: 1.5rem;
    align-items: center;
    .file-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .first-section {
        display: flex;
        column-gap: 1rem;
        align-items: center;
        .file-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 4rem;
          height: 4rem;
          border-radius: 0.5rem;
          background-color: $white;
          font-size: 2rem;
          color: $primaryViolet;
        }
        .file-details {
          display: flex;
          flex-direction: column;
          .file-name {
            color: $darkViolet;
          }
          .file-size {
            font-size: 1.8rem;
            color: $darkGrey;
          }
        }
      }
      .file-download {
        font-size: 2rem;
        color: $darkGrey;
      }
    }
  }
}
</style>
