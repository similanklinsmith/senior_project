<template>
  <div class="inbox-body-section">
    <div class="inbox">
      <div class="search-filter">
        <div class="input-icon">
          <i class="icon fa-solid fa-magnifying-glass"></i>
          <input
            id="search-input-inbox"
            class="small-text"
            type="text"
            :placeholder="text['inbox']['placeholder']"
            v-model="searchInput"
            @focus="onFocus"
            @blur="onBlur"
          />
        </div>
      </div>
      <div class="inbox-list">
        <transition-group name="route">
          <InboxComp
            v-for="inbox in filterByTitle"
            :key="inbox.id"
            :id="inbox.id"
            :title="inbox.title"
            :content="inbox.content"
            :time="inbox.time"
            :selectedId="selectedId"
            @selectInbox="selectInbox"
          />
          <div v-if="filterByTitle.length == 0" class="remark-text not-found">
            Not found
          </div>
        </transition-group>
      </div>
    </div>
    <transition name="route">
      <div class="inbox-detail" v-if="selectedInbox != null">
        <div class="title remark-text">{{ selectedInbox.title }}</div>
        <div class="sent-from smallest-text">
          sent on {{ formatDateTime(selectedInbox.create_at) }} by
          <span>{{ selectedInbox.secretary.name }}</span> &lt;{{
            selectedInbox.secretary.email
          }}&gt;
        </div>
        <div class="line" />
        <div class="main-details">
          <div class="label-header">
            <div class="bold-small-text">Date:</div>
            <div class="bold-small-text">Start at:</div>
            <div class="bold-small-text">Location:</div>
            <div class="bold-small-text">Organizer:</div>
            <div class="bold-small-text">Attendees:</div>
          </div>
          <div class="detail">
            <div class="small-text">
              {{ formatDate(selectedInbox.meeting_date) }} ({{
                formatDateShort(selectedInbox.meeting_date)
              }})
            </div>
            <div class="small-text">
              {{ formatDateTime(selectedInbox.start, true) }} -
              {{ formatDateTime(selectedInbox.end, true) }}
            </div>
            <div class="small-text">{{ selectedInbox.location }}</div>
            <div class="small-text">{{ selectedInbox.secretary.name }}</div>
            <div class="small-text">
              <span
                v-for="(attendee, index) in selectedInbox.attendees.slice(
                  0,
                  slice
                )"
                :key="attendee.id"
              >
                {{ attendee.first_name }} {{ attendee.last_name }}
                <span v-if="index < selectedInbox.attendees.length - 1">,</span>
              </span>
              <span
                class="see-more"
                v-if="selectedInbox.attendees.length > 3"
                @click="showAllAttendee"
                ><span v-if="!isShowMore"
                  >show more&#40;{{
                    selectedInbox.attendees.length - 3
                  }}&#41;</span
                ><span v-else>show less</span></span
              >
            </div>
          </div>
        </div>
        <div class="line" />
        <div class="meeting-detail small-text">
          {{ selectedInbox.description }}
        </div>
        <div class="meeting-link">
          <div class="meeting-link-label">
            <div class="bold-small-text">Meeting Link</div>
            <div @click="copyLink('meeting-link-value')">
              <i class="icon fa-regular fa-copy"></i>
            </div>
          </div>
          <div class="meeting-link-detail">
            <div class="small-text" id="meeting-link-value">
              {{ selectedInbox.meeting_link }}
            </div>
          </div>
        </div>
        <div class="attachment-file">
          <div class="attachment-file-label bold-small-text">
            Attachment File
          </div>
          <div class="attachment-download">
            <div class="file-section">
              <div class="first-section">
                <div class="file-icon">
                  <i class="icon fa-solid fa-file"></i>
                </div>
                <div class="file-details">
                  <div class="file-name bold-smallest-text">
                    {{ selectedInbox.file.title }}.{{
                      selectedInbox.file.fileType
                    }}
                  </div>
                  <div class="file-size smallest-text">
                    {{ formatFileSize(selectedInbox.file.size) }}
                  </div>
                </div>
              </div>
              <div class="file-download">
                <i class="icon fa-solid fa-caret-down"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import InboxComp from "@/components/meeting/InboxComp.vue";
import {
  formatDateTimeDetail,
  formatDateTimeHeader,
  formatDateTimeInbox,
} from "@/helpers/formatDateTime";
import { formatBytes } from "@/helpers/formatFileSize";
export default {
  name: "InboxView",
  components: { InboxComp },
  data() {
    return {
      text: null,
      lang: null,
      searchInput: "",
      slice: 3,
      isShowMore: false,
      toBeConfirmedList: [],
      selectedInbox: null,
      selectedId: null,
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
    formatFileSize(size) {
      return formatBytes(size);
    },
    formatDateTime(dateTime, isTime) {
      return formatDateTimeDetail(dateTime, isTime);
    },
    formatDate(date) {
      return formatDateTimeHeader(date);
    },
    formatDateShort(date) {
      return formatDateTimeInbox(date);
    },
    showAllAttendee(attendees) {
      this.isShowMore = !this.isShowMore;
      this.isShowMore ? (this.slice = attendees.length) : (this.slice = 3);
    },
    selectInbox(id) {
      this.selectedId = id;
      // this.selectedInbox = this.toBeConfirmedList.find((toBeConfirmed) => {
      //   this.selectedId = id;
      //   return toBeConfirmed.id == id;
      // });
      // try {
      // this.inboxDetail = await this.$store.dispatch(
      //   "getMyBeConfirmedDetail",
      //   this.selectedId
      // );
      //   console.log(this.inboxDetail);
      //   this.isLoading = false;
      // } catch (error) {
      //   this.isLoading = false;
      // }
    },
    copyLink(value) {
      let copyText = document.getElementById(value).innerHTML;
      navigator.clipboard.writeText(copyText);
    },
    onFocus() {
      document.getElementById("search-input-inbox").placeholder = this.text['inbox']['focusSearch'];
    },
    onBlur() {
      document.getElementById("search-input-inbox").placeholder = this.text['inbox']['placeholder'];
    },
  },
  mounted() {
    (this.selectedInbox = {
      id: 1,
      title: "Discover what’s happened this week",
      create_at: "2022-05-15T07:40:32.000Z",
      secretary: {
        id: "j7aVGmANS2ebgTBNL5ID3C8Q19v2",
        name: "SIMILAN KLINSMITH",
        email: "similan.klinsmith@mail.kmutt.ac.th",
      },
      meeting_date: "2022-10-15T00:00:00.000Z",
      start: "2022-05-15T10:40:32.000Z",
      end: "2022-05-15T11:40:32.000Z",
      location: "Microsoft Team",
      other_location: null,
      attendees: [
        {
          id: 1,
          title_code: "AssocProf",
          first_name: "winter",
          last_name: "jung",
          img_profile: "default_profile.png",
          email: "winter@gmail.com",
        },
        {
          id: 2,
          title_code: "AssocProf",
          first_name: "winter",
          last_name: "jung",
          img_profile: "default_profile.png",
          email: "winter@gmail.com",
        },
        {
          id: 4,
          title_code: "AssocProf",
          first_name: "minjung",
          last_name: "kim",
          img_profile: "default_profile.png",
          email: "minjung@gmail.com",
        },
        {
          id: 5,
          title_code: "AssocProf",
          first_name: "Test",
          last_name: "Test surname",
          img_profile: "default_profile.png",
          email: "test@gmail.com",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
      meeting_link: "www.teams.com/meeting/ASokp98e/Uid1112",
      file: {
        title: "filename",
        fileType: "pdf",
        size: 120000,
      },
    }),
      (this.toBeConfirmedList = [
        {
          id: "1",
          title: "Discover what’s happened this week",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
          time: "2022-05-15T07:40:32.000Z",
        },
        {
          id: "2",
          title: "Let's have meeting",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
          time: "2022-05-15T07:40:32.000Z",
        },
        {
          id: "3",
          title: "Whatcha doin today everyone?",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
          time: "2022-05-15T07:40:32.000Z",
        },
        {
          id: "4",
          title: "Discover what’s happened this week",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
          time: "2022-05-15T07:40:32.000Z",
        },
        {
          id: "5",
          title: "Discover what’s happened this week",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
          time: "2022-05-15T07:40:32.000Z",
        },
        {
          id: "6",
          title: "Discover what’s happened this week",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum fuga perspiciatis esse consequatur sequi consequuntur!",
          time: "2022-05-15T07:40:32.000Z",
        },
      ]);
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
.response {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 50rem;
  overflow: scroll;
  margin: 1rem 0;
  padding: 0 1rem;
}
.response::-webkit-scrollbar {
  display: block !important;
  -ms-overflow-style: auto !important;
  scrollbar-width: auto !important;
  background-color: transparent;
  width: 1rem;
}
.response::-webkit-scrollbar-track {
  margin: 1rem;
  border-radius: 0.5rem;
}
.response::-webkit-scrollbar-thumb {
  background-color: $grey;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}
.response::-webkit-scrollbar-thumb:hover {
  background-color: $darkGrey;
}
.inbox-body-section {
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
      height: 62.5rem;
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
    .line {
      width: 100%;
      height: 0.1rem;
      background-color: $bgColor;
      margin: 2rem 0;
    }
    .main-details {
      display: grid;
      grid-template-columns: 0.15fr 0.85fr;
      .label-header,
      .detail {
        display: flex;
        flex-direction: column;
        row-gap: 2rem;
      }
      .detail {
        color: $primaryViolet;
        .see-more {
          color: $primaryViolet;
          text-decoration: underline;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s all ease-in-out;
          &:hover {
            color: $darkViolet;
          }
        }
      }
    }
    .meeting-detail {
      text-indent: 1rem;
      line-height: 1.8;
      max-height: 25rem;
      overflow-y: scroll;
    }
    .meeting-detail::-webkit-scrollbar {
      display: block !important;
      -ms-overflow-style: auto !important;
      scrollbar-width: auto !important;
      background-color: transparent;
      width: 1rem;
    }
    .meeting-detail::-webkit-scrollbar-track {
      margin: 1rem;
      border-radius: 0.5rem;
    }
    .meeting-detail::-webkit-scrollbar-thumb {
      background-color: $grey;
      border-radius: 0.5rem;
      transition: all 0.2s ease-in-out;
    }
    .meeting-detail::-webkit-scrollbar-thumb:hover {
      background-color: $darkGrey;
    }
    .meeting-link {
      display: flex;
      flex-direction: column;
      margin-top: 2rem;
      row-gap: 1rem;
      .meeting-link-label {
        display: flex;
        align-items: center;
        .icon {
          color: $darkGrey;
          font-size: 1.8rem;
          margin-left: 0.5rem;
          cursor: pointer;
          transition: 0.2s all ease-in-out;
        }
        .icon:hover {
          color: $highlightViolet;
        }
      }
      .meeting-link-detail {
        color: $primaryViolet;
        cursor: pointer;
      }
    }
    .attachment-file {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
      .attachment-download {
        width: 27rem;
        height: 7rem;
        border-radius: 0.5rem;
        padding: 1.6rem 2rem;
        background-color: $primaryGrey;
        display: flex;
        row-gap: 1.5rem;
        align-items: center;
        cursor: pointer;
        .file-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          .first-section {
            display: flex;
            column-gap: 1rem;
            align-items: center;
            .file-icon {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 4rem;
              height: 4rem;
              border-radius: 0.5rem;
              background-color: $white;
              font-size: 1.4rem;
              color: $primaryViolet;
            }
            .file-details {
              display: flex;
              flex-direction: column;
              .file-name {
                color: $darkViolet;
              }
              .file-size {
                color: $darkGrey;
              }
            }
          }
          .file-download {
            font-size: 1.4rem;
            color: $darkGrey;
          }
        }
      }
    }
    .sent-from {
      color: $darkGrey;
      span {
        text-decoration: underline;
      }
    }
    .button {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
