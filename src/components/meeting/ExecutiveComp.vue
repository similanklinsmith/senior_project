<template>
  <div
    class="executive flex-col-center"
    @click="selectExecutive(id)"
    :style="selectedId == id ? { backgroundColor: '#DBD2FF' } : {}"
  >
    <div class="profile-section">
      <div class="profile-image" v-if="image == 'default_profile.png'">
        <img
          src="../../assets/decorations/sample_profile.png"
          alt="sample profile illustration"
        />
      </div>
      <div class="real-profile-image" v-else>
        <img
          :src="urlImage + '/' + image"
          alt="sample profile illustration"
          @error="
            $event.target.src =
              'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
          "
        />
      </div>
      <div class="executive-profile">
        <div class="name common-text">
          {{ title }} {{ firstname }}
          {{ lastname }}
        </div>
        <div class="position thin-content-text" v-if="position">
          {{ position.length > 30 ? position.slice(0, 31) + "..." : position }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "selectedId",
    "id",
    "title",
    "firstname",
    "lastname",
    "position",
    "image",
  ],
  data() {
    return {
      urlImage: this.$store.state.imageURL,
    };
  },
  methods: {
    selectExecutive(id) {
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
  .profile-section {
    display: flex;
    width: 100%;
    padding: 1.8rem;
    column-gap: 2.4rem;
    .real-profile-image {
      border-radius: 1rem;
      max-width: 5.2rem;
      max-height: 5.2rem;
      background-color: $fadedViolet;
      text-align: center;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .profile-image {
      border-radius: 1rem;
      max-width: 5.2rem;
      max-height: 5.2rem;
      background-color: $fadedViolet;
      text-align: center;
      padding: 0.4rem;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
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
@media (max-width: 40em) {
  .executive {
    .profile-section {
      display: flex;
      width: 100%;
      padding: 1.8rem;
      column-gap: 1.2rem;
    }
  }
}
</style>
