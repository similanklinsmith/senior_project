<template>
  <teleport to="#portal-target" v-if="isShowAttendees">
    <div class="modal" @click="onClosePopup()"></div>
    <div class="pop-up">
      <div class="bold-content-text">Attendees</div>
      <div class="search-filter">
        <div class="input-icon">
          <i class="icon fa-solid fa-magnifying-glass"></i>
          <input
            id="search-input"
            class="small-text"
            type="text"
            placeholder="Search by name"
            v-model="searchInput"
            @focus="onFocus"
            @blur="onBlur"
          />
        </div>
      </div>
      <div class="pop-up-content">
        <div class="list-checkbox content-text" v-if="filterByName.length != 0">
          <transition-group name="route">
            <div
              class="executive-checkbox"
              v-for="attendee in attendees"
              :key="attendee.executive.id"
            >
              <label :for="attendee.executive.id">
                <div
                  class="profile-image"
                  v-if="attendee.executive.img_profile == 'default_profile.png'"
                >
                  <img
                    src="@/assets/decorations/sample_profile.png"
                    alt="sample profile illustration"
                  />
                </div>
                <div class="real-profile-image" v-else>
                  <img
                    :src="urlImage + '/' + attendee.executive.img_profile"
                    alt="sample profile illustration"
                    @error="
                      $event.target.src =
                        'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
                    "
                  />
                </div>
                {{ formatAttendee(attendee) }}</label
              >
            </div>
          </transition-group>
        </div>
        <transition v-else name="route">
          <div class="remark-text not-found">Not Found</div>
        </transition>
      </div>
    </div>
  </teleport>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "BaseAttendeesPopup",
  props: ["attendees", "isShowAttendees"],
  emits: ["onClosePopup"],
  data() {
    return {
      urlImage: this.$store.state.imageURL,
      searchInput: "",
    };
  },
  computed: {
    ...mapGetters(["getterExecutiveTitles"]),
    filterByName() {
      return this.attendees.filter((attendee) => {
        return (
          attendee.executive.first_name
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          attendee.executive.last_name
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
        );
      });
    },
  },
  methods: {
    ...mapActions(["getExecutiveTitle"]),
    onFocus() {
      document.getElementById("search-input").placeholder = "Type to find...";
    },
    onBlur() {
      document.getElementById("search-input").placeholder = "Search by name";
    },
    onClosePopup() {
      this.searchInput = "";
      this.$emit("onClosePopup", false);
    },
    formatTitle(str) {
      return this.getterExecutiveTitles[str];
    },
    formatAttendee(attendee) {
      return `${this.formatTitle(attendee.executive.title_code)} ${
        attendee.executive.first_name
      } ${attendee.executive.last_name}`;
    },
  },
  mounted() {
    this.getExecutiveTitle();
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.modal {
  width: 100%;
  height: 100vh;
  position: fixed;
  background-color: rgba(24, 24, 26, 0.4);
  z-index: 11;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.pop-up {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  z-index: 12;
  border-radius: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $white;
  width: 50rem;
  padding: 2.4rem 1.6rem;
  animation-name: appears;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  .image {
    transform: translateY(-3.6rem);
    img {
      width: 17.5rem;
    }
  }
  .bold-content-text {
    width: 100%;
    color: $primaryViolet;
    margin-bottom: 1rem;
  }
  .bold-small-text {
    width: 100%;
    margin-bottom: 1.2rem;
    span {
      color: $highlightViolet;
    }
  }
  .search-filter {
    margin-bottom: 1.5rem;
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
      .icon {
        position: absolute;
        right: 0;
        font-size: 1.4rem;
        margin-right: 1rem;
        color: $darkGrey;
      }
    }
  }
  .pop-up-content {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    width: 100%;
    height: 40rem;
    overflow: scroll;
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $darkGrey;
      height: 100%;
    }
    .list-checkbox {
      width: 100%;
      display: flex;
      flex-direction: column;
      color: $darkViolet;
      row-gap: 1.5rem;
      .executive-checkbox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        label {
          display: flex;
          align-items: center;
          column-gap: 1.5rem;
        }
        input[type="checkbox"] {
          border-radius: 0.6rem;
          width: 2.4rem;
          height: 2.4rem;
          -webkit-appearance: none;
          box-shadow: inset 0 0 0 1px rgba(85, 85, 85, 0.25);
        }
        input[type="checkbox"]:checked {
          background-color: $yellow;
        }
        .profile-image {
          border-radius: 1rem;
          width: 5rem;
          height: 5rem;
          background-color: $fadedViolet;
          padding: 0.8rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .real-profile-image {
          border-radius: 1rem;
          width: 5rem;
          height: 5rem;
          background-color: $fadedViolet;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
  .button-action {
    width: 100%;
    row-gap: 1rem;
  }
}
</style>
