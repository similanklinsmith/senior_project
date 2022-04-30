<template>
<div>
  <div class="first-body-section">
    <div class="card-section">
      <div class="add-attendees">
        <div class="bold-content-text">Add attendees</div>
        <div class="small-text required-attendees">Required attendees</div>
        <div class="selected-attendees">
          <div
            class="selected-attendee"
            v-for="attendee in form.selectedAttendees"
            :key="attendee.id"
          >
            <div class="profile-section">
              <div class="profile-image">
                <img
                  src="../../../assets/decorations/sample_profile.png"
                  alt="sample profile illustration"
                />
              </div>
              <div class="executive-profile flex-col-center">
                <div class="name small-text">
                  {{ attendee.title }}. {{ attendee.firstname }}
                  {{ attendee.lastname }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="action-add" @click="isAddAttendees = true">
          <i class="fa-solid fa-user-plus"></i>
          <div class="small-text">Add required attendees</div>
        </div>
      </div>
      <div class="add-details">
        <div class="input-form">
          <label for="title" class="bold-small-text">Title</label>
          <input
            class="small-text"
            type="text"
            placeholder="Title"
            id="title"
            name="title"
          />
        </div>
        <div class="input-form-row">
          <div class="input">
            <label for="date" class="bold-small-text">Date Slot</label>
            <litepie-datepicker
              class="small-text"
              id="date"
              :disable-date="dDate"
              v-model="dateValue"
              as-single
              use-range
              :formatter="formatter"
              :style="{ fontSize: '12px !important', marginTop: '1rem' }"
            />
          </div>
          <div class="input">
            <label for="duration" class="bold-small-text"
              >Durations of meeting</label
            >
            <select name="duration" id="duration">
              <option value="">none</option>
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
              <option value="5">5 hours</option>
              <option value="6">6 hours</option>
            </select>
          </div>
        </div>
        <div class="input-form-row">
          <div class="input">
            <label for="due" class="bold-small-text">Due Date</label>
            <litepie-datepicker
              id="due"
              :disable-date="dDate"
              as-single
              :formatter="formatter"
              v-model="dateValue"
              :style="{ fontSize: '12px !important', marginTop: '1rem' }"
            />
          </div>
          <div class="input"></div>
        </div>
        <div class="input-form-button">
          <div></div>
          <BaseButton
            buttonType="common-button"
            btnText="Send Poll"
            textColor="white"
            textHover="white"
            color="#7452FF"
            hoverColor="#23106D"
          >
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
  <teleport to="#portal-target" v-if="isAddAttendees">
    <div class="modal" @click="onClickCancelAttendees"></div>
    <div class="pop-up">
      <div class="remark-text">Required attendees</div>
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
      <div class="pop-up-content">
        <div class="list-checkbox content-text" v-if="filterByName.length != 0">
          <transition-group name="route">
            <div
              class="executive-checkbox"
              v-for="executive in filterByName"
              :key="executive.id"
            >
              <label :for="executive.id">
                <div class="profile-image">
                  <img
                    src="../../../assets/decorations/sample_profile.png"
                    alt="sample profile illustration"
                  />
                </div>
                {{ executive.title }}. {{ executive.firstname }}
                {{ executive.lastname }}</label
              >
              <input
                type="checkbox"
                :name="executive.id"
                :id="executive.id"
                :value="executive"
                v-model="form.selectedAttendees"
              />
            </div>
          </transition-group>
        </div>
        <transition v-else name="route">
          <div class="remark-text not-found">Not Found</div>
        </transition>
      </div>
      <div class="button-action">
        <BaseButton
          buttonType="common-button"
          btnText="Confirm"
          textColor="white"
          textHover="white"
          color="#7452FF"
          hoverColor="#23106D"
          width="100%"
          @onClick="onClickConfirmAttendees"
        >
        </BaseButton>
      </div>
    </div>
  </teleport>
  </div>
</template>

<script>
import LitepieDatepicker from "litepie-datepicker";
import BaseButton from "../../../components/UI/BaseButton.vue";
import { ref } from "vue";
export default {
  components: { BaseButton, LitepieDatepicker },
  setup() {
    const dateValue = ref([]);
    const dDate = (date) => {
      return date < new Date() || date > new Date(2023, 0, 8);
    };
    const formatter = ref({
      date: "DD MMM YYYY",
      month: "MMM",
    });

    return {
      dateValue,
      dDate,
      formatter,
    };
  },
  data() {
    return {
      isSelected: 4,
      isAddAttendees: false,
      executives: [],
      searchInput: "",
      form: {
        selectedAttendees: [],
      },
    };
  },
  computed: {
    filterByName() {
      return this.executives.filter((executive) => {
        return (
          executive.firstname
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          executive.lastname
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
        );
      });
    },
  },
  methods: {
    onClickConfirmAttendees() {
      this.isAddAttendees = false;
    },
    onClickCancelAttendees() {
      this.isAddAttendees = false;
      this.form.selectedAttendees = [];
    },
  },
  mounted() {
    this.executives = [
      {
        id: 1,
        title: "Mr",
        firstname: "Similan",
        lastname: "Klinsmith",
        position: "Chief Executive",
        email: "similan@mail.kmutt.ac.th",
        tel: "081-000-0000",
        reportTo: "Alexander Macedonia",
        imageProfile: "",
      },
      {
        id: 2,
        title: "Ms",
        firstname: "Praepanwa",
        lastname: "Tedprasit",
        position: "Chief Executive",
        email: "praepanwa@mail.kmutt.ac.th",
        tel: "081-000-0000",
        reportTo: "Alexander Macedonia",
        imageProfile: "",
      },
      {
        id: 3,
        title: "Ms",
        firstname: "Noparat",
        lastname: "Prasongdee",
        position: "Chief Executive",
        email: "noparat@mail.kmutt.ac.th",
        tel: "081-000-0000",
        reportTo: "Alexander Macedonia",
        imageProfile: "",
      },
    ].sort((a, b) => (a.firstname > b.firstname ? 1 : -1));
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/colors/webColors.scss";
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
  width: 44rem;
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
  .remark-text {
    width: 100%;
    color: $primaryViolet;
    margin-bottom: 1rem;
    span {
      color: $darkGrey !important;
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
    height: 30rem;
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
      }
    }
  }
  .button-action {
    width: 100%;
    row-gap: 1rem;
  }
}
.first-body-section {
  padding: 3rem;
  width: 100%;
  height: 100%;
  .card-section {
    padding: 5rem 4.4rem;
    width: 100%;
    height: 100%;
    background-color: $white;
    border-radius: 2.5rem;
    display: grid;
    grid-template-columns: 0.5fr 1.5fr;
    .add-attendees {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .bold-content-text {
        margin-bottom: 2rem;
      }
      .required-attendees {
        margin-bottom: 1.4rem;
      }
      .selected-attendees {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 1rem;
        .selected-attendee {
          margin-bottom: 1rem;
          .profile-section {
            display: flex;
            width: 100%;
            .profile-image {
              border-radius: 1rem;
              width: 3.5rem;
              height: 3.5rem;
              background-color: $fadedViolet;
              margin-right: 0.5rem;
              text-align: center;
              padding: 0.2rem;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
      .action-add {
        cursor: pointer;
        display: flex;
        color: $primaryViolet;
        align-items: center;
        column-gap: 0.8rem;
        transition: 0.2s all ease-in-out;
      }
      .action-add:hover {
        color: $highlightViolet;
      }
    }
    .add-details {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      row-gap: 2rem;
      .input-form-button {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .input-form-row {
        width: 100%;
        display: flex;
        column-gap: 2.4rem;
        .input {
          width: 100%;
        }
      }
      .input-form {
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      select,
      input[type="text"] {
        margin-top: 1rem;
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
      select::placeholder,
      input::placeholder {
        font-size: 1.4rem;
        color: $darkGrey;
      }
      select {
        font-size: 1.4rem;
      }
      select:focus {
        outline: none;
        border: 0.1rem solid $primaryViolet;
      }
    }
  }
}
</style>
