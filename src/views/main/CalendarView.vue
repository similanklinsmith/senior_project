<template>
  <div class="calendar-screen">
    <BaseHeader
      :headerText="`Calendar Overview`"
      :contentText="`This screen illustrates your calendar schedule.`"
    >
      <BaseButton
        buttonType="common-button"
        btnText="Create poll meeting +"
        textColor="#23106D"
        textHover="white"
        color="#DBD2FF"
        hoverColor="#23106D"
      >
      </BaseButton>
    </BaseHeader>
    <div class="body">
      <div class="first-body-section grid">
        <div class="first-col">
          <div class="card">
            <vue-cal
              class="vuecal--date-picker vuecal--violet-theme"
              hide-view-selector
              xsmall
              :time="false"
              active-view="month"
              :disable-views="['week','day']"
            >
            </vue-cal>
          </div>
          <div class="filter-executive">
            <div class="remark-text">Executive label</div>
            <div class="search-filter">
              <div class="input-icon">
                <i class="icon fa-solid fa-magnifying-glass"></i>
                <input
                  class="small-text"
                  type="text"
                  placeholder="Search by name"
                  v-model="searchInput"
                />
              </div>
            </div>
            <div
              class="list-executive-card"
              :style="
                filterByName.length >= 6
                  ? { overflowY: 'scroll' }
                  : { overflow: 'hidden' }
              "
            >
              <transition-group name="route" v-if="!getterLoadingStatus">
                <ExecutiveComp
                  v-for="(executive, index) in filterByName"
                  :key="index"
                  @selectExecutive="selectExecutive"
                  :id="executive.id"
                  :title="formatTitle(executive.title_code)"
                  :firstname="executive.first_name"
                  :lastname="executive.last_name"
                  :image="executive.img_profile"
                  :selectedId="selectedId"
                />
                <div
                  v-if="filterByName.length == 0"
                  class="remark-text not-found"
                >
                  Not found
                </div>
              </transition-group>
              <div
                v-if="getterLoadingStatus"
                class="remark-text not-found loading"
              >
                Loading...
              </div>
            </div>
          </div>
        </div>
        <div class="calendar-show">
          <vue-cal
            class="vuecal--date-picker vuecal--violet-theme"
            hide-view-selector
            :time="false"
            active-view="month"
            :disable-views="['week']"
          >
          </vue-cal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseHeader from "@/components/UI/BaseHeader.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import ExecutiveComp from "@/components/meeting/ExecutiveComp.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CalendarView",
  components: { BaseHeader, BaseButton, VueCal, ExecutiveComp },
  data() {
    return {
      searchInput: "",
      selectedExecutive: null,
      selectedId: null,
    };
  },
  computed: {
    ...mapGetters([
      "getterExecutives",
      "getterLoadingStatus",
      "getterExecutiveTitles",
    ]),
    getExecutivesList() {
      return this.$store.getters.getterExecutives;
    },
    filterByName() {
      return this.getExecutivesList.filter((executive) => {
        return (
          executive.first_name
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          executive.last_name
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
        );
      });
    },
  },
  methods: {
    ...mapActions(["getExecutives", "getExecutiveTitle"]),
    formatTitle(str) {
      return this.getterExecutiveTitles[str];
    },
    selectExecutive(id) {
      this.selectedExecutive = this.getExecutivesList.find((executive) => {
        this.selectedId = id;
        return executive.id == id;
      });
    },
  },
  created() {
    this.getExecutives();
    this.getExecutiveTitle();
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.calendar-screen {
  .body {
    padding: 3rem;
    .first-body-section {
      grid-template-columns: 1fr 2fr;
      column-gap: 3rem;
      .first-col {
        display: flex;
        flex-direction: column;
        .card {
          overflow: hidden;
          position: relative;
          height: 50rem;
          width: 100%;
          background-color: $white;
          border-radius: 2.5rem;
        }
        .filter-executive {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          row-gap: 1rem;
          position: relative;
          margin-top: 3rem;
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
                height: 4rem;
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
          .list-executive-card::-webkit-scrollbar {
            display: block !important;
            -ms-overflow-style: auto !important;
            scrollbar-width: auto !important;
            background-color: transparent;
            width: 1.4rem;
          }
          .list-executive-card::-webkit-scrollbar-track {
            margin: 1rem;
            border-radius: 0.5rem;
          }
          .list-executive-card::-webkit-scrollbar-thumb {
            background-color: $grey;
            border-radius: 0.5rem;
            transition: all 0.2s ease-in-out;
          }
          .list-executive-card::-webkit-scrollbar-thumb:hover {
            background-color: $darkGrey;
          }
          .list-executive-card {
            width: 100%;
            height: 100%;
            border-radius: 1.5rem;
            background-color: $white;
            overflow: hidden;
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
            .loading {
              animation-name: floating;
              -webkit-animation-name: floating;
              animation-duration: 3s;
              -webkit-animation-duration: 3s;
              animation-iteration-count: infinite;
              -webkit-animation-iteration-count: infinite;
            }
          }
        }
      }
      .calendar-show {
        overflow: hidden;
        position: relative;
        height: 100%;
        width: 100%;
        background-color: $white;
        border-radius: 2.5rem;
      }
    }
  }
}
</style>
