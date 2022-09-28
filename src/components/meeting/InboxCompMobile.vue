<template>
  <div class="inbox-comp" @click="handleClick">
    <div class="profile-image">
      <img
        src="@/assets/decorations/sample_profile.png"
        alt="sample profile illustration"
      />
    </div>
    <div class="info">
      <div class="inbox-title bold-common-text">
        <span>{{
          title.length > 30 ? title.substring(0, 30) + "..." : title
        }}</span
        ><span>{{ formatDateTime(time) }}</span>
      </div>
      <div class="inbox-content content-text">
        {{ getContent.length > 50 ? getContent.substring(0, 50) + "..." : getContent }}
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateTimeInbox } from "@/helpers/formatDateTime";
export default {
  name: "InboxCompMobile",
  props: ["title", "content", "id", "time", "type"],
  methods: {
    formatDateTime(dateTime) {
      return formatDateTimeInbox(dateTime);
    },
    handleClick() {
      this.$emit("handleClick", this.id);
    },
  },
  computed: {
    getContent() {
      switch (this.type) {
        case "sent":
          return "sent poll appointment";
        case "beConfirmed":
          return "need to answer poll appointment";
        case "results":
          return "see the result of the poll";
        case "replied":
          return "replied to " + this.title;
        default:
          return this.content;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.inbox-comp {width: 100%;height: 12rem;background-color: #ffffff;display: flex;column-gap: 2rem;padding: 2.4rem;transition: all 0.2s ease-in-out;border-radius: 1rem;margin: 1rem 0;.profile-image {min-height: 8rem;min-width: 8rem;border-radius: 1rem;background-color: $fadedViolet;display: flex;justify-content: center;align-items: center;padding: 1rem;img {width: 100%;height: 100%;}}.info {width: 100%;display: flex;flex-direction: column;justify-content: center;row-gap: 0.8rem;.inbox-title {display: flex;justify-content: space-between;}}}
</style>
