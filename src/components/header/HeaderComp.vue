<template>
  <div class="container grid grid--4-cols">
    <div class="remark-text">Meeting Overview</div>
    <div class="search-input"><input type="text" placeholder="Search anything... "></div>
    <div class="remark-text">Meeting Overview</div>
    <div class="remark-text">Meeting Overview</div>
  </div>
</template>

<script>
export default {
  name: "HeaderComp",
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.container {
  width: 100%;
  height: 10em;
  background-color: $white;
  align-items: center;
  justify-items: center;
  padding: 3em 5.5em;
  .remark-text {
    color: $darkViolet;
  }
  .search-input {
    width: 100%;
    input[type=text] {
      width: 100%;
      height: 2.4em;
      border-radius: 0.5em;
      border: none;
      background-color: $primaryGrey;
    }
    input[type=text]:focus {
  border: 1px solid $primaryViolet;
}
  }
}
</style>
