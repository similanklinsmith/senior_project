<template>
  <div class="to-be-confirmed-body-section">
    <div class="inbox">
      <div class="search-filter">
        <div class="input-icon">
          <i class="icon fa-solid fa-magnifying-glass"></i>
          <input
            class="small-text"
            type="text"
            placeholder="Search by title"
            v-model="searchInput"
          />
        </div>
      </div>
      <div class="inbox-list">
        <transition-group name="route">
          <InboxComp
            v-for="inbox in filterByTitle"
            :key="inbox.id"
            :inbox="inbox"
            :selectedId="selectedId"
            @selectInbox="selectInbox"
          />
          <div v-if="filterByTitle.length == 0" class="remark-text not-found">
            Not found
          </div>
        </transition-group>
      </div>
    </div>
    <div class="inbox-detail" v-if="selectedInbox != null">
      <div class="title remark-text">{{ selectedInbox.title }}</div>
      <div class="sent-from smallest-text">
        created poll at 11:30 AM 04 Apr 2022
      </div>
      <div class="result">
        <ResultComp v-for="res in response.responses" :key="res.id" :response="res"/>
      </div>
    </div>
  </div>
</template>

<script>
import InboxComp from "../../../components/meeting/InboxComp.vue";
import ResultComp from "../../../components/meeting/ResultComp.vue";

export default {
  name: "ConfirmedView",
  components: { InboxComp, ResultComp },
  data() {
    return {
      searchInput: "",
      toBeConfirmedList: [],
      selectedInbox: null,
      selectedId: null,
      response: null,
    };
  },
  computed: {
    filterByTitle() {
      return this.toBeConfirmedList.filter((toBeConfirmed) => {
        return toBeConfirmed.title
          .toLowerCase()
          .includes(this.searchInput.toLowerCase());
      });
    },
  },
  methods: {
    selectInbox(id) {
      this.selectedInbox = this.toBeConfirmedList.find((toBeConfirmed) => {
        this.selectedId = id;
        return toBeConfirmed.id == id;
      });
    },
  },
  mounted() {
    this.toBeConfirmedList = [
      {
        id: 1,
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
      {
        id: 2,
        title: "Let's have meeting",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
      {
        id: 3,
        title: "Whatcha doin today everyone?",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
      {
        id: 4,
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
      {
        id: 5,
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
      {
        id: 6,
        title: "Discover what’s happened this week",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
        time: "11:30 AM",
      },
    ];
    this.response = {
      id: 1,
      title: "Discover what’s happened this week",
      dateTime: "11:30 AM 04 Apr 2022",
      responses: [
        {
          id: 1,
          dateTime: "Wednesday, April 06, 2022",
          accepted: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
            {
              id: 3,
              title: "Ms",
              firstname: "Noparat",
              lastname: "Prasongdee",
              imageProfile: "",
            },
            {
              id: 4,
              title: "Mr",
              firstname: "John",
              lastname: "Smith",
              imageProfile: "",
            },
          ],
          declined: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
            {
              id: 3,
              title: "Ms",
              firstname: "Noparat",
              lastname: "Prasongdee",
              imageProfile: "",
            },
            {
              id: 4,
              title: "Mr",
              firstname: "John",
              lastname: "Smith",
              imageProfile: "",
            },
          ],
          notResponse: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
          ],
        },
        {
          id: 2,
          dateTime: "Thursday, April 04, 2022",
          accepted: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
            {
              id: 3,
              title: "Ms",
              firstname: "Noparat",
              lastname: "Prasongdee",
              imageProfile: "",
            },
            {
              id: 4,
              title: "Mr",
              firstname: "John",
              lastname: "Smith",
              imageProfile: "",
            },
          ],
          declined: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
            {
              id: 3,
              title: "Ms",
              firstname: "Noparat",
              lastname: "Prasongdee",
              imageProfile: "",
            },
            {
              id: 4,
              title: "Mr",
              firstname: "John",
              lastname: "Smith",
              imageProfile: "",
            },
          ],
          notResponse: [
            {
              id: 1,
              title: "Mr",
              firstname: "Similan",
              lastname: "Klinsmith",
              imageProfile: "",
            },
            {
              id: 2,
              title: "Ms",
              firstname: "Praepanwa",
              lastname: "Tedprasit",
              imageProfile: "",
            },
            {
              id: 3,
              title: "Ms",
              firstname: "Noparat",
              lastname: "Prasongdee",
              imageProfile: "",
            },
            {
              id: 4,
              title: "Mr",
              firstname: "John",
              lastname: "Smith",
              imageProfile: "",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/colors/webColors.scss";
.result {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 50rem;
  overflow: scroll;
  margin: 1rem 0;
  padding: 0 1rem;
}
.result::-webkit-scrollbar {
  display: block !important;
  -ms-overflow-style: auto !important;
  scrollbar-width: auto !important;
  background-color: transparent;
  width: 1rem;
}
.result::-webkit-scrollbar-track {
  margin: 1rem;
  border-radius: 0.5rem;
}
.result::-webkit-scrollbar-thumb {
  background-color: $grey;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}
.result::-webkit-scrollbar-thumb:hover {
  background-color: $darkGrey;
}
.to-be-confirmed-body-section {
  display: grid;
  grid-template-columns: 0.35fr 0.65fr;
  column-gap: 2.2rem;
  padding: 3rem;
  .inbox {
    width: 100%;
    height: 100%;
    border-radius: 2.2rem;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
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
    .inbox-list {
      height: 66rem;
      width: 100%;
      background-color: $white;
      border-radius: 2.2rem;
      overflow: scroll;
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
  }
  .inbox-detail {
    width: 100%;
    height: 100%;
    background-color: $white;
    border-radius: 2.5rem;
    padding: 5rem 4.4rem;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .sent-from {
      color: $darkGrey;
    }
    .button {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
