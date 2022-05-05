<template>
  <div
    class="executive flex-col-center"
    @click="selectExecutive(executive.id)"
    :style="selectedId == executive.id ? { backgroundColor: '#DBD2FF' } : {}"
  >
    <div class="profile-section">
      <div class="profile-image">
        <img
          src="../../assets/decorations/sample_profile.png"
          alt="sample profile illustration"
        />
      </div>
      <div class="executive-profile">
        <div class="name common-text">
          {{ executive.title_code }}. {{ executive.first_name }}
          {{ executive.last_name }}
        </div>
        <div class="position thin-content-text">{{ executive.position }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["executive", "selectedId"],
  data() {
    return {
      // isSelected: false,
    };
  },
  methods: {
    selectExecutive(id) {
      // this.isSelected = !this.isSelected;
      this.$emit("selectExecutive", id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.executive:hover {
  background-color: $primaryGrey;
}
.executive {
  cursor: pointer;
  width: 100%;
  transition: 0.2s all ease-in-out;
  /* margin: 1rem 0; */
  /* background-color: $fadedViolet; */
  /* border-radius: 1rem; */
  .profile-section {
    display: flex;
    width: 100%;
    padding: 1.8rem;
    .profile-image {
      border-radius: 1rem;
      width: 5.2rem;
      height: 5.2rem;
      background-color: $fadedViolet;
      margin-right: 2.4rem;
      text-align: center;
      padding: 0.4rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .executive-profile {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: left;
    row-gap: 0.6rem;
    .name {
      color: $darkViolet;
      transition: 0.3s all ease-in-out;
      line-height: 1.2;
    }
    .position {
      color: $highlightViolet;
    }
  }
}
</style>
