<template>
  <div
    class="inbox-component"
    @click="selectInbox(id)"
    :style="selectedId == id ? { backgroundColor: '#DBD2FF' } : {}"
  >
    <div class="flex-col-center">
      <div class="profile-image">
        <img
          src="@/assets/decorations/sample_profile.png"
          alt="sample profile illustration"
        />
      </div>
    </div>

    <div class="inbox-information">
      <div
        class="title-inbox"
        :style="selectedId == id ? { color: '#7452FF' } : {}"
      >
        <div class="title bold-small-text">
          {{ title.length > 20 ? title.substring(0, 20) + "..." : title }}
        </div>
        <div class="time bold-small-text">{{ formatDateTime(time) }}</div>
      </div>
      <div class="content-inbox small-text" v-if="content">
        {{ content.length > 50 ? content.substring(0, 50) + "..." : content }}
      </div>
      <div class="content-inbox small-text" v-else>Poll appointments</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InboxComp",
  props: ["selectedId", "title", "content", "id", "time"],
  methods: {
    selectInbox(id) {
      this.$emit("selectInbox", id);
    },
    formatDateTime(dateTime) {
      var currentdate = new Date();
      var now = `${currentdate.getFullYear()}-${(
        "0" +
        (currentdate.getMonth() + 1)
      ).slice(-2)}-${("0" + currentdate.getDate()).slice(-2)}`;
      if (
        new Date(now).toDateString() ==
        new Date(dateTime.split("T")[0]).toDateString()
      ) {
        var date = new Date(dateTime);
        let hours = date.getHours();
        let ampm = hours >= 12 ? "PM" : "AM";
        return date.getHours()+":"+date.getMinutes()+" "+ampm;
      } else {
        return new Date(dateTime).toLocaleDateString()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.inbox-component:hover {background-color: $fadedViolet;}
.inbox-component {width: 100%;height: 10rem;background-color: $white;display: grid;grid-template-columns: 0.25fr 0.75fr;justify-content: center;align-items: center;padding: 1.4rem;box-shadow: 0 0 0 1px $grey;transition: all 0.2s ease-in-out;cursor: pointer;.profile-image {border-radius: 1rem;width: 5.2rem;height: 5.2rem;background-color: $fadedViolet;text-align: center;padding: 0.4rem;img {width: 100%;height: 100%;}}.inbox-information {display: flex;flex-direction: column;row-gap: 0.8rem;.title-inbox {display: flex;justify-content: space-between;}.content-inbox {line-height: 1.4;}}}
</style>
