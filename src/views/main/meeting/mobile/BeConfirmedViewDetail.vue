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
      <div class="response">
        <ResponseComp />
        <ResponseComp />
        <ResponseComp />
        <ResponseComp />
        <ResponseComp />
        <ResponseComp />
      </div>
    </template>
  </MaskMeetingDetailMobile>
</template>

<script>
import MaskMeetingDetailMobile from "@/components/meeting/MaskMeetingDetailMobile.vue";
import ResponseComp from "@/components/meeting/ResponseComp.vue";
import { useRoute } from "vue-router";
export default {
  name: "BeConfirmedViewDetail",
  components: { MaskMeetingDetailMobile, ResponseComp },
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
          lastname: "Singka",
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
.expired-date {
  font-size: 2rem;
  font-weight: 500;
  color: $primaryViolet;
  span {
    color: $error;
  }
}
.response {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 100%;
  overflow: scroll;
  margin: 1rem 0;
  padding: 0 1rem;
}
.response::-webkit-scrollbar {
  display: block !important;
  -ms-overflow-style: auto !important;
  scrollbar-width: auto !important;
  background-color: transparent;
  width: 1rem;
}
.response::-webkit-scrollbar-track {
  margin: 1rem;
  border-radius: 0.5rem;
}
.response::-webkit-scrollbar-thumb {
  background-color: $grey;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}
.response::-webkit-scrollbar-thumb:hover {
  background-color: $darkGrey;
}
</style>
