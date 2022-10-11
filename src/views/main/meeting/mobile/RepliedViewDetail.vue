<template>
  <div v-if="!isLoading && inboxDetail != null">
    <MaskMeetingDetailMobile
      :title="inboxDetail.title"
      :dateTime="inboxDetail.create_at"
      :type="'replied'"
      :sender="
        inboxDetail.secretary.first_name + ' ' + inboxDetail.secretary.last_name
      "
    >
      <template v-slot:detail-slot>
        <div class="line" />
        <div class="response">
          <div
            class="response-container"
            v-for="(executive, index) in inboxDetail.executives"
            :key="index"
          >
            <div>
              <div class="name remark-text">
                {{ executive.first_name }} {{ executive.last_name }}
                <span>({{text['replied']['required']}})</span>
              </div>
              <div class="bold-small-text label-text">{{text['replied']['preferTimeslot']}}</div>
            </div>
            <div
              v-for="(response, index) in executive.responses"
              :key="index"
              class="days"
            >
              <div
                class="bold-content-text"
                :style="
                  response.is_accept == '1'
                    ? { color: '#39CF5A' }
                    : { color: '#F33C3C' }
                "
              >
                {{ formatDateTimeHeader(response.date) }}
                <span v-if="response.is_accept != '1'">({{text['replied']['declined']}})</span>
              </div>
              <div class="slots" v-if="response.is_accept != '0'">
                <div
                  class="show-time-slot"
                  v-for="time in response.periodOfTime"
                  :key="time"
                >
                  <div class="bold-content-text">
                    {{text['replied']['from']}} {{ time.from.split(":")[0] }}:{{
                      time.from.split(":")[1]
                    }}, {{text['replied']['end']}} {{ time.to.split(":")[0] }}:{{
                      time.to.split(":")[1]
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </MaskMeetingDetailMobile>
  </div>
  <BaseNotFound v-else :isFailed="isFailed" />
</template>

<script>
import MaskMeetingDetailMobile from "@/components/meeting/MaskMeetingDetailMobile.vue";
import BaseNotFound from "@/components/UI/BaseNotFound.vue";
import { mapGetters, mapActions } from "vuex";
import { useRoute } from "vue-router";
import { formatDateTimeHeader } from "@/helpers/formatDateTime";
export default {
  name: "BeConfirmedViewDetail",
  components: { MaskMeetingDetailMobile, BaseNotFound },
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
      isLoading: false,
      inboxDetail: null,
      dataToBe: {},
    };
  },
  computed: {
    ...mapGetters(["getterMyReplyDetail"]),
  },
  methods: {
    ...mapActions(["getMyReplyDetail"]),
    async getReplyDetail() {
        this.inboxDetail = await this.$store.dispatch(
          "getMyReplyDetail",
          this.id
        );
        this.inboxDetail == null ? this.isFailed = true : this.isFailed = false;
        this.isLoading = false;
    },
    formatDateTimeHeader(dateTime) {
      return formatDateTimeHeader(dateTime);
    },
  },
  created() {
    console.log(`This is params id: ${this.id}`);
    console.log(`This is params type: ${this.type}`);
    this.getReplyDetail();
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
.loading {height: 100vh;color: $highlightViolet;animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.response {display: flex;flex-direction: column;row-gap: 3.6rem;height: 100%;overflow: scroll;margin: 1rem 0;padding: 0 1rem;.response-container {display: flex;flex-direction: column;row-gap: 2.4rem;.name {span {color: $primaryViolet;font-weight: 400;}}.label-text {margin-top: 1rem;color: $darkGrey;}.days {display: flex;flex-direction: column;row-gap: 2rem;}.slots {display: flex;flex-direction: column;row-gap: 0.25rem;.show-time-slot {width: fit-content;border: 1px solid $darkViolet;padding: 3rem 3.4rem;border-radius: 0.5rem;margin: 0.25rem 0;.bold-smallest-text {color: $darkViolet !important;}}}}}.response::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1rem;}.response::-webkit-scrollbar-track {margin: 1rem;border-radius: 0.5rem;}.response::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}.response::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}
</style>