<template>
  <div>
    <div class="first-body-section">
      <div class="mobile remark-text">{{text['meeting']['header']}}</div>
      <div class="card-section">
        <div class="input-mobile-button">
          <BaseButton
            buttonType="common-button"
            :btnText="text['createPoll']['mobileSend']"
            textColor="white"
            textHover="white"
            color="#7452FF"
            hoverColor="#23106D"
            width="100%"
            @onClick="handleSendPoll"
          >
          </BaseButton>
        </div>
        <div class="add-attendees">
          <div class="bold-content-text">
            {{text['createPoll']['addAttendee']}}<span class="required">*</span>
            <div class="bold-small-text required">{{ errors.attendees }}</div>
          </div>
          <div class="small-text required-attendees">{{text['createPoll']['requiredAttendee']}}</div>
          <div class="selected-attendees">
            <div
              class="selected-attendee"
              v-for="attendee in form.selectedAttendees"
              :key="attendee.id"
            >
              <div class="profile-section">
                <div
                  class="real-profile-image"
                  v-if="attendee.img_profile != 'default_profile.png'"
                >
                  <img
                    :src="urlImage + '/' + attendee.img_profile"
                    alt="sample profile illustration"
                    @error="
                      $event.target.src =
                        'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
                    "
                  />
                </div>
                <div class="profile-image" v-else>
                  <img
                    src="@/assets/decorations/sample_profile.png"
                    alt="sample profile illustration"
                  />
                </div>
                <div class="executive-profile flex-col-center">
                  <div class="name small-text">
                    {{ formatTitle(attendee.title_code) }}
                    {{ attendee.first_name }}
                    {{ attendee.last_name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="action-add" @click="isAddAttendees = true">
            <i class="fa-solid fa-user-plus"></i>
            <div class="small-text">{{text['createPoll']['addRequiredAttendee']}}</div>
          </div>
        </div>
        <form @submit.prevent="handleSendPoll" class="add-details">
          <div class="input-form">
            <label for="title" class="bold-small-text"
              >{{text['createPoll']['title']}}<span class="required">*</span></label
            >
            <input
              class="small-text"
              type="text"
              :placeholder="text['createPoll']['title']"
              id="title"
              name="title"
              v-model="form.title"
            />
            <div class="bold-small-text required">{{ errors.title }}</div>
          </div>
          <div class="input-form-row">
            <div class="input">
              <label for="date" class="bold-small-text"
                >{{text['createPoll']['dateSlot']}}<span class="required"
                  >*</span
                ></label
              >
              <litepie-datepicker
                class="small-text"
                id="date"
                :disable-date="dDate"
                v-model="form.dateSlot"
                as-single
                use-range
                :formatter="formatter"
                :style="{ fontSize: '1.6rem !important', marginTop: '1rem' }"
              />
              <div class="bold-small-text required">{{ errors.dateSlot }}</div>
            </div>
            <div class="input">
              <label for="duration" class="bold-small-text"
                >{{text['createPoll']['duration']}}<span class="required"
                  >*</span
                ></label
              >
              <select name="duration" id="duration" v-model="form.duration">
                <option value="">{{text['input']['none']}}</option>
                <option value="1">1 hour</option>
                <option value="1.5">1.5 hour</option>
                <option value="2">2 hours</option>
                <option value="2.5">2.5 hours</option>
                <option value="3">3 hours</option>
                <option value="3.5">3.5 hours</option>
                <option value="4">4 hours</option>
                <option value="4.5">4.5 hours</option>
                <option value="5">5 hours</option>
                <option value="5.5">5.5 hours</option>
                <option value="6">6 hours</option>
                <option value="6.5">6.5 hours</option>
              </select>
              <div class="bold-small-text required">{{ errors.duration }}</div>
            </div>
          </div>
          <div class="input-form-row" v-if="form.dateSlot">
            <div class="input">
              <label for="due" class="bold-small-text"
                >{{text['createPoll']['dueDate']}}<span class="required"
                  >*</span
                ></label
              >
              <litepie-datepicker
                id="due"
                :disable-date="disableDate"
                as-single
                :formatter="formatter"
                v-model="form.dueDate"
                :style="{ fontSize: '1.6rem !important', marginTop: '1rem' }"
              />
              <div class="bold-small-text required">{{ errors.dueDate }}</div>
            </div>
            <div class="input"></div>
          </div>
          <div class="input-form-button">
            <div></div>
            <BaseButton
              buttonType="common-button"
              :btnText="text['createPoll']['mobileSend']"
              textColor="white"
              textHover="white"
              color="#7452FF"
              hoverColor="#23106D"
              type="submit"
            >
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
    <teleport to="#portal-target" v-if="isAddAttendees">
      <transition name="route" appear>
        <div class="modal" @click="onClickCancelAttendees"></div>
      </transition>
      <transition name="route" appear>
        <div class="pop-up">
          <div class="remark-text">{{text['createPoll']['requiredAttendee']}}</div>
          <div class="search-filter">
            <div class="input-icon">
              <i class="icon fa-solid fa-magnifying-glass"></i>
              <input
                class="small-text"
                type="text"
                :placeholder="text['createPoll']['searchName']"
                v-model="searchInput"
              />
            </div>
          </div>
          <div class="pop-up-content">
            <div
              v-if="getterLoadingStatus"
              class="remark-text not-found loading"
            >
              {{text['createPoll']['loading']}}
            </div>
            <div
              class="list-checkbox content-text"
              v-else-if="filterByName.length != 0"
            >
              <transition-group name="route">
                <div
                  class="executive-checkbox"
                  v-for="executive in filterByName"
                  :key="executive.id"
                >
                  <label :for="executive.id">
                    <div
                      class="real-profile-image"
                      v-if="executive.img_profile != 'default_profile.png'"
                    >
                      <img
                        :src="urlImage + '/' + executive.img_profile"
                        alt="sample profile illustration"
                        @error="
                          $event.target.src =
                            'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
                        "
                      />
                    </div>
                    <div class="profile-image" v-else>
                      <img
                        src="@/assets/decorations/sample_profile.png"
                        alt="sample profile illustration"
                      />
                    </div>
                    {{ formatTitle(executive.title_code) }}
                    {{ executive.first_name }} {{ executive.last_name }}</label
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
              <div class="remark-text not-found">{{text['createPoll']['notFound']}}</div>
            </transition>
          </div>
          <div class="button-action">
            <BaseButton
              buttonType="common-button"
              :btnText="text['createPoll']['confirm']"
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
      </transition>
    </teleport>
    <BaseAlert v-if="getterSuccess" :status="`success`">
      {{text['createPoll']['success']}}
    </BaseAlert>
    <BaseAlert v-if="getterFailed" :status="`failed`">
      {{text['createPoll']['failed']}}
    </BaseAlert>
      <teleport to="#portal-target" v-if="isLoading">
        <div class="modal">
          <div class="pop-up-loading flex-col-center">
            <div class="flex-col-center">
              <div class="logo header-text">
                <span class="primary-violet">M</span>OMENT<span class="yellow">O</span
                ><span class="faded-violet">.</span>
              </div>
              <div class="image">
                <img
                  src="@/assets/decorations/sending.png"
                  alt="sending illustrations"
                />
              </div>
              <div class="remark-text" style="color: white">{{text['createPoll']['sending']}}</div>
            </div>
          </div>
        </div>
      </teleport>
  </div>
</template>

<script>
import LitepieDatepicker from "litepie-datepicker";
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseAlert from "@/components/UI/BaseAlert.vue";
import { mapGetters, mapActions } from "vuex";
import { ref } from "vue";
export default {
  components: { BaseButton, LitepieDatepicker, BaseAlert },
  setup() {
    const dDate = (date) => {
      return date < new Date();
    };
    const formatter = ref({
      date: "YYYY-MM-DD",
      month: "MMM",
    });
    return {
      dDate,
      formatter,
    };
  },
  data() {
    return {
      text: null,
      lang: null,
      urlImage: this.$store.state.imageURL,
      isAddAttendees: false,
      tempAttendees: [],
      searchInput: "",
      isLoading: false,
      form: {
        selectedAttendees: [],
        title: "",
        dateSlot: "",
        duration: "",
        dueDate: "",
      },
      errors: {},
    };
  },
  computed: {
    ...mapGetters([
      "getterSuccess",
      "getterFailed",
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
    attendeesIsValid() {return !!(this.form.selectedAttendees.length != 0);},
    titleIsValid() {return !!this.form.title;},
    dateSlotIsValid() {return !!this.form.dateSlot;},
    durationIsValid() {return !!this.form.duration;},
    dueDateIsValid() {return !!this.form.dueDate;},
    dueDateLessIsValid() {return (new Date(this.form.dueDate) < new Date (this.form.dateSlot.split(" ~ ")[0]));},
  },
  methods: {
    ...mapActions(["getExecutives", "getExecutiveTitle"]),
    disableDate(date) {
      return (
        date < new Date() || date > new Date(this.form.dateSlot.split(" ~ ")[0])
      );
    },
    formatTitle(str) {
      return this.getterExecutiveTitles[str];
    },
    onClickConfirmAttendees() {
      this.isAddAttendees = false;
      this.form.selectedAttendees = [
        ...this.tempAttendees,
        ...this.form.selectedAttendees,
      ];
    },
    onClickCancelAttendees() {
      this.isAddAttendees = false;
      this.tempAttendees = [];
      this.form.selectedAttendees = [
        ...this.tempAttendees,
        ...this.form.selectedAttendees,
      ];
    },
    handleSendPoll() {
      this.titleIsValid
        ? delete this.errors.title
        : (this.errors.title = this.text['errors']['title']);
      this.attendeesIsValid
        ? delete this.errors.attendees
        : (this.errors.attendees = this.text['errors']['attendee']);
      this.dateSlotIsValid
        ? delete this.errors.dateSlot
        : (this.errors.dateSlot = this.text['errors']['dateSlot']);
      if(this.dueDateIsValid){delete this.errors.dueDate; if(this.dueDateLessIsValid){delete this.errors.dueDate}else{this.errors.dueDate="Due date cannot be exceeded date slot"}}else{this.errors.dueDate=this.text['errors']['dueDate']}
      this.durationIsValid
        ? delete this.errors.duration
        : (this.errors.duration = this.text['errors']['duration']);
      if (Object.keys(this.errors).length == 0) {
        let dateSlots = this.form.dateSlot.split(" ~ ");
        let attendees_id = this.form.selectedAttendees.map((attendee) => {
          return attendee.id.toString();
        });
        var currentdate = new Date();
        var createTime = `${currentdate.getFullYear()}-${(
          "0" +
          (currentdate.getMonth() + 1)
        ).slice(-2)}-${("0" + currentdate.getDate()).slice(
          -2
        )} ${currentdate.getHours()}:${("0" + currentdate.getMinutes()).slice(
          -2
        )}:${currentdate.getSeconds()}`;
        const newPoll = {
          start_date: dateSlots[0],
          end_date: dateSlots[1],
          title: this.form.title,
          due_date_time: this.form.dueDate,
          duration_of_time: this.form.duration,
          create_at: createTime,
          executive_id: attendees_id,
        };
        this.isLoading = true
        this.$store.dispatch("addPollAppointment", newPoll).then(() => {this.isLoading = false}).catch((err) => {console.log(err), this.isLoading = false});
        this.form.title = "";
        this.form.dateSlot = "";
        this.form.duration = "";
        this.form.dueDate = "";
        this.form.selectedAttendees = [];
      }
    },
  },
  created() {
    this.getExecutives();
    this.getExecutiveTitle();
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

<style lang="scss" scoped>
@import "@/assets/colors/webColors.scss";
.mobile.remark-text{display:none;}
.input-mobile-button {display: none;order: 3;}
.required {color: $error;margin-top: 0.8rem;font-size: 1.4rem !important;}
.pop-up-loading {position: fixed;z-index: 12;padding: 2.4rem 1.6rem;color: $darkViolet;.flex-col-center {animation-name: floating;-webkit-animation-name: floating;animation-duration: 2s;-webkit-animation-duration: 2s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.logo {.primary-violet {color: $primaryViolet;}.yellow {color: $yellow;}.faded-violet {color: $fadedViolet;}}.image {width: 15rem;height: 15rem;img {width: 100%;height: 100%;}}}
.loading {animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}
.modal {.sending{color:$yellow}width: 100%;height: 100vh;position: fixed;background-color: rgba(24, 24, 26, 0.4);z-index: 11;display: flex;flex-direction: column;align-items: center;justify-content: center;}
.pop-up {top: 50%;left: 50%;transform: translate(-50%, -50%);position: fixed;z-index: 12;border-radius: 2.5rem;display: flex;flex-direction: column;align-items: center;background-color: $white;width: 44rem;padding: 2.4rem 1.6rem;animation-name: appears;animation-duration: 0.5s;animation-iteration-count: 1;.image {transform: translateY(-3.6rem);img {width: 17.5rem;}}.remark-text {width: 100%;color: $primaryViolet;margin-bottom: 1rem;span {color: $darkGrey !important;}}.search-filter {margin-bottom: 1.5rem;position: relative;width: 100%;display: flex;align-items: center;justify-items: center;.input-icon {width: 100%;display: flex;align-items: center;justify-items: center;input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}.icon {position: absolute;right: 0;font-size: 1.4rem;margin-right: 1rem;color: $darkGrey;}}}.pop-up-content {display: flex;flex-direction: column;margin-bottom: 1rem;width: 100%;height: 30rem;overflow: scroll;.not-found {display: flex;align-items: center;justify-content: center;color: $darkGrey;height: 100%;}.loading {animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.list-checkbox {width: 100%;display: flex;flex-direction: column;color: $darkViolet;row-gap: 1.5rem;.executive-checkbox {display: flex;align-items: center;justify-content: space-between;label {cursor: pointer;display: flex;align-items: center;column-gap: 1.5rem;}input[type="checkbox"] {cursor: pointer; border-radius: 0.6rem;width: 2.4rem;height: 2.4rem;-webkit-appearance: none;box-shadow: inset 0 0 0 1px rgba(85, 85, 85, 0.25);}input[type="checkbox"]:checked {background-color: $yellow;}.real-profile-image {border-radius: 1rem;width: 5rem;height: 5rem;background-color: $fadedViolet;overflow: hidden;img {width: 100%;height: 100%;object-fit: cover;}}.profile-image {border-radius: 1rem;width: 5rem;height: 5rem;background-color: $fadedViolet;padding: 0.8rem;img {width: 100%;height: 100%;}}}}}.button-action {width: 100%;row-gap: 1rem;}}
.first-body-section {padding: 3rem;width: 100%;height: 100%;.card-section {padding: 5rem 4.4rem;width: 100%;height: 100vh;background-color: $white;border-radius: 2.5rem;display: grid;grid-template-columns: 0.5fr 1.5fr;column-gap: 2rem;.add-attendees {width: 100%;height: 100%;display: flex;flex-direction: column;.bold-content-text {margin-bottom: 2rem;}.required-attendees {margin-bottom: 1.4rem;}.selected-attendees {display: flex;flex-direction: column;width: 100%;margin-bottom: 1rem;.selected-attendee {margin-bottom: 1rem;.profile-section {display: flex;width: 100%;column-gap: 0.8rem;.executive-profile {width: 15rem;flex-wrap: wrap !important;align-items: flex-start !important;}.real-profile-image {border-radius: 1rem;width: 3.5rem;height: 3.5rem;background-color: $fadedViolet;overflow: hidden;img {width: 100%;height: 100%;object-fit: cover;}}.profile-image {border-radius: 1rem;width: 3.5rem;height: 3.5rem;background-color: $fadedViolet;margin-right: 0.5rem;text-align: center;padding: 0.2rem;img {width: 100%;height: 100%;}}}}}.action-add {cursor: pointer;display: flex;color: $primaryViolet;align-items: center;column-gap: 0.8rem;transition: 0.2s all ease-in-out;}.action-add:hover {color: $highlightViolet;}}.add-details {width: 100%;height: 100%;display: flex;flex-direction: column;row-gap: 2rem;.input-form-button {width: 100%;display: flex;justify-content: space-between;}.input-form-row {width: 100%;display: flex;column-gap: 2.4rem;.input {width: 100%;}}.input-form {width: 100%;display: flex;flex-direction: column;}select,input[type="text"] {margin-top: 1rem;padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}select::placeholder,input::placeholder {font-size: 1.4rem;color: $darkGrey;}select {font-size: 1.4rem;}select:focus {outline: none;border: 0.1rem solid $primaryViolet;}}}}
@media (max-width: 26.75em) {.pop-up{width:50rem;.pop-up-content{height:40rem}}.mobile.remark-text{color:$darkViolet;display:block;margin:2.4rem 0}input,select {height: 4.8rem !important;}input[type="checkbox"] {height: 2.4rem !important;}.input-mobile-button {display: block;order: 3;}.first-body-section {padding: 0rem;.card-section {display: flex;flex-direction: column;row-gap: 4rem;padding: 8rem 4.4rem;height: fit-content;.add-attendees {order: 2;height: fit-content;.bold-content-text {font-size: 1.6rem;}.selected-attendees {.selected-attendee {.profile-section {.executive-profile {width: fit-content;}}}}}.add-details {height: fit-content;row-gap: 4rem;.input-form-button {display: none;}.input-form-row {flex-direction: column;row-gap: 4rem;}}}}}
</style>