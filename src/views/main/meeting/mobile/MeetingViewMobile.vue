<template>
  <div class="meeting-mobile-screen">
    <div class="header">
      <div class="remark-text">{{ header }}</div>
      <!-- <div class="result content-text">
        &#40;{{
          searchInput != "" || withInDate != ""
            ? filterByTitle.length
            : getPollsList.length
        }}
        results&#41;
      </div> -->
      <div class="result content-text">
        &#40;{{
          searchInput != "" || withInDate != ""
            ? filterByTitle.length
            : maximumLength
        }}
        {{text['sent']['results']}}&#41;
      </div>
    </div>
    <div class="body">
      <div class="filter">
        <div class="search-filter">
          <div class="input-icon">
            <i class="icon fa-solid fa-magnifying-glass"></i>
            <input
              id="search-input-mobile"
              class="small-text"
              type="text"
              :placeholder="text['sent']['placeholder']"
              v-model="searchInput"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>
        </div>
        <div class="filter-list" @click="toggleDropdown">
          <i class="fa-solid fa-filter icon"></i>
          <div class="alert" v-if="filterDate"></div>
        </div>
        <div
          class="dropdown__content"
          :class="`${isShowDropdown ? 'is-show' : ''}`"
        >
          <ul>
            <li>
              <div class="input">
                <label for="due" class="bold-small-text">{{text['sent']['dateWithin']}}</label>
                <litepie-datepicker
                  id="due"
                  as-single
                  :disable-date="dDate"
                  :formatter="formatter"
                  v-model="withInDate"
                  :style="{ fontSize: '12px !important', marginTop: '1rem' }"
                />
              </div>
            </li>
            <li>
              <BaseButton
                buttonType="common-button"
                :btnText="text['sent']['search']"
                textColor="#23106D"
                textHover="#23106D"
                color="#DBD2FF"
                hoverColor="#A58EFF"
                width="100%"
                @onClick="handleFilterDate"
              >
              </BaseButton>
            </li>
          </ul>
        </div>
      </div>
      <div class="inbox-body">
        <!-- :maximum="getPollsList.length" -->
        <BaseInifniteScroll
          :showLoading="loading"
          @loadMore="loadMore()"
          :maximum="maximumLength"
          :length="cards.length"
        >
          <transition-group name="route" appear>
            <InboxCompMobile
              v-for="inbox in filterByTitle"
              :key="inbox.id"
              :title="inbox.title"
              :time="inbox.create_at"
              :content="inbox.content"
              :id="inbox.id"
              :type="type"
              @handleClick="onNav"
            />
            <div class="remark-text not-found" v-if="filterByTitle.length == 0">
              {{text['sent']['notFound']}}
            </div>
          </transition-group>
        </BaseInifniteScroll>
      </div>
    </div>
  </div>
</template>

<script>
import LitepieDatepicker from "litepie-datepicker";
import InboxCompMobile from "@/components/meeting/InboxCompMobile.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseInifniteScroll from "@/components/UI/BaseInifniteScroll.vue";
import { mapGetters, mapActions } from "vuex";
import { ref } from "vue";
export default {
  name: "MeetingViewMobile",
  components: {
    InboxCompMobile,
    BaseButton,
    BaseInifniteScroll,
    LitepieDatepicker,
  },
  props: ["header", "index"],
  setup() {
    const dDate = (date) => {
      return date > new Date();
    };
    const formatter = ref({
      date: "YYYY-MM-DD",
      month: "MMM",
    });
    return {
      formatter,
      dDate
    };
  },
  data() {
    return {
      text: null,
      lang: null,
      loading: false,
      upto: 10,
      searchInput: "",
      selectedInbox: null,
      selectedId: null,
      slice: 2,
      isShowDropdown: false,
      withInDate: "",
      filterDate: "",
      maximumLength: null,
      type: "",
    };
  },
  static: {
    limitScrollItems: 10,
  },
  computed: {
    ...mapGetters(["getterMyPolls", "getterMyBeConfirmeds", "getterMyReplies"]),
    cards() {
      if (this.index == 3) {
        this.setType('sent')
        this.changeMaximum(this.getterMyPolls);
        const card = this.getterMyPolls.slice(0, this.upto).map((item) => {
          return item;
        });
        return card;
      }
      if (this.index == 4) {
        this.setType('beConfirmed');
        this.changeMaximum(this.getterMyBeConfirmeds);
        const card = this.getterMyBeConfirmeds
          .slice(0, this.upto)
          .map((item) => {
            return item;
          });
        return card;
      }
      if (this.index == 5) {
        this.setType('results')
        this.changeMaximum(this.getterMyPolls);
        const card = this.getterMyPolls.slice(0, this.upto).map((item) => {
          return item;
        });
        return card;
      }
      if (this.index == 6) {
        this.setType('replied');
        this.changeMaximum(this.getterMyReplies);
        const card = this.getterMyReplies.slice(0, this.upto).map((item) => {
          return item;
        });
        return card;
      }
      return [];
    },
    getPollsList() {
      return this.$store.getters.getterMyPolls;
    },
    getBeConfirmedList() {
      return this.$store.getters.getterMyBeConfirmeds;
    },
    filterByTitle() {
      //   if (this.searchInput != "") {
      //     return this.getPollsList.filter((toBeConfirmed) => {
      //       if (this.filterDate) {
      //         return (
      //           toBeConfirmed.title
      //             .toLowerCase()
      //             .includes(this.searchInput.toLowerCase()) &&
      //           new Date(
      //             toBeConfirmed.create_at.split("T")[0]
      //           ).toLocaleDateString() ==
      //             new Date(this.filterDate).toLocaleDateString()
      //         );
      //       } else {
      //         return toBeConfirmed.title
      //           .toLowerCase()
      //           .includes(this.searchInput.toLowerCase());
      //       }
      //     });
      //   } else {
      //     return this.cards.filter((toBeConfirmed) => {
      //       if (this.filterDate) {
      //         return (
      //           toBeConfirmed.title
      //             .toLowerCase()
      //             .includes(this.searchInput.toLowerCase()) &&
      //           new Date(
      //             toBeConfirmed.create_at.split("T")[0]
      //           ).toLocaleDateString() ==
      //             new Date(this.filterDate).toLocaleDateString()
      //         );
      //       } else {
      //         return toBeConfirmed.title
      //           .toLowerCase()
      //           .includes(this.searchInput.toLowerCase());
      //       }
      //     });
      //   }
      if (this.searchInput != "") {
        return this.cards.filter((toBeConfirmed) => {
          if (this.filterDate) {
            return (
              toBeConfirmed.title
                .toLowerCase()
                .includes(this.searchInput.toLowerCase()) &&
              new Date(
                toBeConfirmed.create_at.split("T")[0]
              ).toLocaleDateString() ==
                new Date(this.filterDate).toLocaleDateString()
            );
          } else {
            return toBeConfirmed.title
              .toLowerCase()
              .includes(this.searchInput.toLowerCase());
          }
        });
      } else {
        return this.cards.filter((toBeConfirmed) => {
          if (this.filterDate) {
            return (
              toBeConfirmed.title
                .toLowerCase()
                .includes(this.searchInput.toLowerCase()) &&
              new Date(
                toBeConfirmed.create_at.split("T")[0]
              ).toLocaleDateString() ==
                new Date(this.filterDate).toLocaleDateString()
            );
          } else {
            return toBeConfirmed.title
              .toLowerCase()
              .includes(this.searchInput.toLowerCase());
          }
        });
      }
    },
  },
  methods: {
    ...mapActions(["getMyPolls", "getMyBeConfirmeds", "getMyReplies"]),
    changeMaximum(data) {
      this.maximumLength = data.length;
    },
    setType(typeStr) {
      this.type = typeStr;
    },
    onNav(id) {
      switch (parseInt(this.index)) {
        case 2:
          this.$router.push({
            name: "inbox-detail",
            params: { type: "inbox", id: id },
          });
          break;
        case 3:
          this.$router.push({
            name: "sent-detail",
            params: { type: "sent", id: id },
          });
          break;
        case 4:
          this.$router.push({
            name: "be-confirmed-detail",
            params: { type: "toBeConfirmed", id: id },
          });
          break;
        case 5:
          this.$router.push({
            name: "confirmed-detail",
            params: { type: "results", id: id },
          });
          break;
        case 6:
          this.$router.push({
            name: "replied-detail",
            params: { type: "replied", id: id },
          });
          break;
        default:
          this.$router.push({
            name: "inbox-detail",
            params: { type: "inbox", id: id },
          });
          break;
      }
    },
    loadMore() {
      const listItems = document.querySelector("#infinite-list");
      let heightToTop = listItems.scrollTop;
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        setTimeout(() => {
          listItems.scrollTo(0, heightToTop);
        }, 1000);
      }
      this.loading = true;
      setTimeout(() => {
        this.cards.map((item) => {
          this.cards.push(item);
        });
        this.upto += this.$options.static.limitScrollItems;
        this.loading = false;
      }, 800);
    },
    onFocus() {
      document.getElementById("search-input-mobile").placeholder = this.text['sent']['focusSearch'];
    },
    onBlur() {
      document.getElementById("search-input-mobile").placeholder = this.text['sent']['placeholder'];
    },
    toggleDropdown() {
      this.isShowDropdown = !this.isShowDropdown;
    },
    handleFilterDate() {
      this.filterDate =
        this.withInDate ?? new Date(this.withInDate).toLocaleDateString();
      this.isShowDropdown = false;
      this.selectedInbox = null;
    },
    selectInbox(id) {
      this.isShowMore = false;
      this.slice = 2;
      this.selectedInbox = this.cards.find((data) => {
        this.selectedId = id;
        return data.id == id;
      });
    },
    calculateRemainingDay(date) {
      return Math.round(
        Math.abs(
          (new Date(Date.now()) - new Date(date)) / (24 * 60 * 60 * 1000)
        )
      );
    },
  },
  created() {
    this.getMyPolls();
    this.getMyBeConfirmeds();
    this.getMyReplies();
  },
  mounted() {
    this.cards;
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
.inbox-body {
  height: 100vh;
  width: 100%;
  .not-found {
    padding: 1.8rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80%;
    text-align: center;
    color: $darkGrey;
  }
}
.infi-scroll {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
}
.meeting-mobile-screen {
  .header {
    display: flex;
    align-items: center;
    column-gap: 1rem;
    width: 100%;
    padding: 3.6rem 3rem;
    background-color: $white;
    border-radius: 1rem;
    margin-bottom: 3rem;
    .remark-text {
      color: $darkViolet;
    }
    .content-text {
      color: $highlightViolet;
    }
  }
  .body {
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
    .filter {
      display: flex;
      column-gap: 0.5rem;
      .filter-list {
        min-width: 4.8rem;
        min-height: 4.8rem;
        background-color: $primaryViolet;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: 0.3s all ease-in-out;
        position: relative;
        .alert {
          transform: translateX(0.4rem) translateY(-0.4rem);
          top: 0%;
          right: 0%;
          min-width: 1.4rem;
          min-height: 1.4rem;
          position: absolute;
          border-radius: 50%;
          background-color: $yellow;
          outline: 0.4rem solid $white;
        }
        .icon {
          font-size: 1.4rem;
          color: $white;
        }
        &:hover {
          background-color: $darkViolet;
        }
      }
    }
    .dropdown__content {
      box-shadow: 0px 0px 5px $fadedViolet;
      z-index: -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 4rem;
      position: absolute;
      right: 0%;
      opacity: 0;
      width: fit-content;
      background-color: $white;
      padding: 2.8rem;
      transition: 0.3s all ease-in-out;
      border-radius: 1.5rem;
      cursor: auto;
      transform: translateX(-2rem);
      ul {
        width: 100%;
        list-style: none;
        display: flex;
        flex-direction: column;
        row-gap: 1.5rem;
        li {
          color: $darkViolet;
          transition: 0.3s all ease-in-out;
        }
      }
      &.is-show {
        transform: translateY(2rem) translateX(-2rem);
        opacity: 1;
        z-index: 1;
        cursor: pointer;
      }
      input[type="text"] {
        padding: 1rem 1.4rem;
        width: 100%;
        height: 4.8rem;
        border-radius: 0.5rem;
        border: none;
        background-color: $primaryGrey;
        font-family: "Poppins", sans-serif;
      }
      input[type="text"]:focus {
        outline: none;
        border: 0.1rem solid $primaryViolet;
      }
      input::placeholder {
        font-size: 1.4rem;
        color: $darkGrey;
      }
    }
    .search-filter {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-items: center;
      .input-icon {
        width: 100%;
        display: flex;
        align-items: center;
        justify-items: center;
        input[type="text"] {
          padding: 1rem 1.4rem;
          width: 100%;
          height: 4.8rem;
          border-radius: 0.5rem;
          border: none;
          background-color: $white;
          font-family: "Poppins", sans-serif;
        }
        input[type="text"]:focus {
          outline: none;
          border: 0.1rem solid $primaryViolet;
        }
        input::placeholder {
          font-size: 1.4rem;
          color: $darkGrey;
        }
        .icon {
          position: absolute;
          right: 0;
          font-size: 1.4rem;
          margin-right: 1rem;
          color: $darkGrey;
        }
      }
    }
  }
}
</style>
