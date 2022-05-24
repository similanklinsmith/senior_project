<template>
  <div
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
    :class="{ 'active-dropzone': active }"
    class="dropzone"
  >
    <span class="bold-smallest-text">Drag or Drop File</span>
    <span>OR</span>
    <label for="dropzoneFile" class="bold-smallest-text">Select File</label>
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
};
</script>

<style scoped lang="scss">
@import "@/assets/colors/webColors.scss";
.dropzone {
  width: 100%;
  height: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 1rem;
  border: 2px dashed $darkGrey;
  background-color: $primaryGrey;
  transition: 0.3s ease all;
  border-radius: 0.5rem;

  label {
    padding: 0.6rem 1.6rem;
    color: $white;
    background-color: $primaryViolet;
    transition: 0.3s ease all;
    cursor: pointer;
  }

  input {
    display: none;
  }
}

.active-dropzone {
  color: $white;
  border-color: $white;
  background-color: $primaryViolet;

  label {
    background-color: $white;
    color: $primaryViolet;
  }
}
</style>
