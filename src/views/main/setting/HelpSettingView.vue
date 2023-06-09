<template>
  <div class="left-side">
    <div class="content-text title">{{ text["help"]["help"] }}</div>
    <div class="search-input">
      <div class="input-icon">
        <i class="icon fa-solid fa-magnifying-glass"></i>
        <input
          id="search-input-help"
          class="small-text"
          type="text"
          :placeholder="text['help']['placeholder']"
          v-model="searchInput"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </div>
    <div class="questions">
      <transition-group name="route" appear>
        <div v-if="filterSearch.length > 0" class="question-section">
          <div v-for="(question, index) in filterSearch" :key="question.id">
            <div
              class="question"
              @click="handleClick(index)"
              :style="question.isSelected ? { color: '#7452FF' } : {}"
            >
              <div class="bold-content-text">
                {{ question.question }}
              </div>
              <div class="icon bold-content-text">
                <span v-if="!question.isSelected">+</span><span v-else>-</span>
              </div>
            </div>
            <div
              class="answer small-text"
              :class="`${question.isSelected ? 'is-expanded' : ''}`"
            >
              <div>
                {{ question.answer }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="not-found flex-col-center remark-text">
          {{ text["help"]["notFound"] }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelpSettingView",
  data() {
    return {
      text: null,
      lang: null,
      indexFormerShow: null,
      searchInput: "",
      isToggled: true,
      faq: null
    };
  },
  methods: {
    copyLink(value) {
      let copyText = document.getElementById(value).innerHTML;
      navigator.clipboard.writeText(copyText);
    },
    onFocus() {
      document.getElementById("search-input-help").placeholder =
        this.text["help"]["focusSearch"];
    },
    onBlur() {
      document.getElementById("search-input-help").placeholder =
        this.text["help"]["placeholder"];
    },
    handleClick(index) {
      this.searchInput != ""
        ? this.indexFormerShow != null
          ? this.indexFormerShow != index
            ? ((this.filterSearch[this.indexFormerShow].isSelected = false),
              (this.filterSearch[index].isSelected =
                !this.filterSearch[index].isSelected))
            : (this.filterSearch[index].isSelected =
                !this.filterSearch[index].isSelected)
          : (this.filterSearch[index].isSelected =
              !this.filterSearch[index].isSelected)
        : this.indexFormerShow != null
        ? this.indexFormerShow != index
          ? ((this.faq[this.indexFormerShow].isSelected = false),
            (this.faq[index].isSelected = !this.faq[index].isSelected))
          : (this.faq[index].isSelected = !this.faq[index].isSelected)
        : (this.faq[index].isSelected = !this.faq[index].isSelected);
      this.indexFormerShow = index;
    },
  },
  computed: {
    filterSearch() {
      return this.faq.filter((question) => {
        return question.question
          .toLowerCase()
          .includes(this.searchInput.toLowerCase());
      });
    },
  },
  beforeMount() {
    if (this.$cookies.get("lang")) {
      this.lang = this.$cookies.get("lang");
    } else {
      this.lang = "en";
    }
    this.text = require(`@/assets/langs/${this.lang}.json`);
    this.faq = [
      {
        id: 1,
        question: this.text['help']['q1'],
        answer: this.text['help']['a1'],
        isSelected: false,
      },
      {
        id: 2,
        question: this.text['help']['q2'],
        answer: this.text['help']['a2'],
        isSelected: false,
      },
      {
        id: 3,
        question: this.text['help']['q3'],
        answer: this.text['help']['a3'],
        isSelected: false,
      },
      {
        id: 4,
        question: this.text['help']['q4'],
        answer: this.text['help']['a4'],
        isSelected: false,
      },
      {
        id: 5,
        question: this.text['help']['q5'],
        answer: this.text['help']['a5'],
        isSelected: false,
      },
      {
        id: 6,
        question: this.text['help']['q6'],
        answer: this.text['help']['a6'],
        isSelected: false,
      },
      {
        id: 7,
        question: this.text['help']['q7'],
        answer: this.text['help']['a7'],
        isSelected: false,
      },
    ];
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.left-side {animation-name: appearsBottom;animation-duration: 0.5s;animation-iteration-count: 1;height: 100vh;background-color: $white;padding: 4.8rem 3.6rem;border-radius: 2.5rem;overflow: hidden;.title {color: $darkGrey;}.search-input {margin: 1.5rem 0;width: 100%;position: relative;.input-icon {width: 100%;display: flex;align-items: center;justify-items: center;input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}.icon {position: absolute;right: 0;font-size: 1.4rem;margin-right: 1rem;color: $darkGrey;}}}.questions::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1.2rem;}.questions::-webkit-scrollbar-track {border-radius: 0.5rem;}.questions::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}.questions::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}.questions {position: relative;overflow: scroll;height: 95%;.not-found {width: 100%;height: 100%;color: $darkGrey;}.question-section {display: flex;flex-direction: column;row-gap: 1rem;.question {transition: 0.3s all ease-in-out;display: flex;justify-content: space-between;background-color: $primaryGrey;padding: 2.6rem;cursor: pointer;border-radius: 0.5rem;&:hover {background-color: $grey;}}.answer {color: $darkViolet;padding: 1rem 2.6rem;line-height: 1.6;transition: visibility 0s, opacity 0.3s linear;opacity: 0;position: absolute;visibility: hidden;&.is-expanded {opacity: 1;position: relative;visibility: visible;}}}}}
@media (max-width: 40em) {.left-side {height: auto;}}
</style>
