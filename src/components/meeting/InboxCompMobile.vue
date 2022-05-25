<template>
  <div class="inbox-comp">
    <div class="profile-image"></div>
    <div class="info">
      <div class="inbox-title bold-common-text">
        <span>{{
          title.length > 30 ? title.substring(0, 30) + "..." : title
        }}</span
        ><span>{{ formatDateTime(time) }}</span>
      </div>
      <div class="inbox-content content-text">
        {{ content.length > 50 ? content.substring(0, 50) + "..." : content }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InboxCompMobile",
  props: ["title", "content", "id", "time"],
  methods: {
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
        return date.getHours() + ":" + date.getMinutes() + " " + ampm;
      } else {
        return new Date(dateTime).toLocaleDateString();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.inbox-comp {
  width: 100%;
  height: 12rem;
  background-color: #ffffff;
  display: flex;
  column-gap: 2rem;
  padding: 2.4rem;
  transition: all 0.2s ease-in-out;
  border-radius: 1rem;
  margin: 1rem 0;
  .profile-image {
    min-height: 8rem;
    min-width: 8rem;
    border-radius: 1rem;
    background-color: $fadedViolet;
  }
  .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 0.8rem;
    .inbox-title {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
