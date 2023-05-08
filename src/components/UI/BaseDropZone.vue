<template>
  <div
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
    :class="{ 'active-dropzone': active }"
    class="dropzone"
  >
    <span class="small-text">{{text['confirmed']['dragDrop']}}</span>
    <span class="smallest-text">{{text['confirmed']['or']}}</span>
    <label for="dropzoneFile" class="small-text">{{text['confirmed']['selectFile']}}</label>
    <input type="file" id="dropzoneFile" class="dropzoneFile" />
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  name: "BaseDropZone",
  setup() {
    const active = ref(false);
    const toggleActive = () => {
      active.value = !active.value;
    };
    return { active, toggleActive };
  },
  data() {
    return {
      text: null,
      lang: null,
    }
  },
  beforeMount() {
    if (this.$cookies.get("lang")) {
      this.lang = this.$cookies.get("lang");
    } else {
      this.lang = "en"
    }
    this.text = require(`@/assets/langs/${this.lang}.json`);
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/colors/webColors.scss";
.dropzone {width: 100%;height: 14rem;display: flex;flex-direction: column;justify-content: center;align-items: center;row-gap: 1rem;border: 2px dashed $darkGrey;background-color: $primaryGrey;transition: 0.3s ease all;border-radius: 0.5rem;label {padding: 0.8rem 1.8rem;color: $white;background-color: $primaryViolet;transition: 0.3s ease all;cursor: pointer;border-radius: 0.5rem;&:hover {background-color: $darkViolet;}}input {display: none;}}
.active-dropzone {color: $white;border-color: $white;background-color: $primaryViolet;label {background-color: $white;color: $primaryViolet;}}
</style>
