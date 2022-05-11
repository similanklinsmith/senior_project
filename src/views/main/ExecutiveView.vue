<template>
  <div class="executive-screen">
    <BaseHeader
      :headerText="`Overall Executives`"
      :contentText="`This screen has features to show, add, edit, and delete your executives`"
    >
      <BaseButton
        buttonType="common-button"
        btnText="Add executive +"
        textColor="#23106D"
        textHover="white"
        color="#DBD2FF"
        hoverColor="#23106D"
        @onClick="handleAdd"
      >
      </BaseButton>
    </BaseHeader>
    <div class="body">
      <div class="first-body-section grid">
        <div class="filter-executive">
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
                :position="formatPosition(executive.position)"
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
        <transition-group name="route">
          <div
            class="container"
            v-if="getExecutivesList.length > 0 && isAddExecutive == false"
          >
            <div @click="toggleDropDown" class="icon-dropdown">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>

            <div
              class="dropdown__content"
              :class="`${isShowDropdown ? 'is-show' : ''}`"
            >
              <ul>
                <li @click="editExecutive(selectedExecutive.id)">
                  <i class="icon fa-solid fa-pencil"></i>
                  <div class="thin-content-text">Edit profile</div>
                </li>
                <li><div class="line" /></li>
                <li class="red-color" @click="isShowPopup = true">
                  <i class="icon fa-solid fa-user-minus"></i>
                  <div class="thin-content-text">Delete executive</div>
                </li>
              </ul>
            </div>
            <div v-if="isLoading" class="remark-text loading">Loading...</div>
            <div class="executive-card grid" v-if="isLoading == false">
              <div class="left-side">
                <div
                  class="real-profile-image"
                  v-if="selectedExecutive?.img_profile != 'default_profile.png'"
                >
                  <img
                    :src="urlImage + '/' + selectedExecutive?.img_profile"
                    alt="sample profile illustration"
                    @error="
                      $event.target.src =
                        'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
                    "
                  />
                </div>
                <div class="profile-image" v-else>
                  <img
                    src="../../assets/decorations/sample_profile.png"
                    alt="sample profile illustration"
                  />
                </div>
                <div class="executive-profile">
                  <div class="name remark-text">
                    {{ formatTitle(selectedExecutive?.title_code) }}
                    {{ selectedExecutive?.first_name }}
                    {{ selectedExecutive?.last_name }}
                  </div>
                  <div class="position thin-content-text">
                    {{ formatPosition(selectedExecutive?.position) }}
                  </div>
                </div>
              </div>
              <div class="right-side">
                <div class="content-text title">Official Information</div>
                <div class="email">
                  <div class="label bold-content-text">
                    Email
                    <div @click="copyLink('email-value')">
                      <i class="icon fa-regular fa-copy"></i>
                    </div>
                  </div>
                  <div class="content-text" id="email-value">
                    {{ selectedExecutive?.email }}
                  </div>
                </div>
                <div class="phone">
                  <div class="label bold-content-text">
                    Phone number
                    <div @click="copyLink('phone-value')">
                      <i class="icon fa-regular fa-copy"></i>
                    </div>
                  </div>
                  <div class="content-text" id="phone-value">
                    {{ formatPhoneNumber(selectedExecutive?.phone_number) }}
                  </div>
                </div>
                <div class="secretary">
                  <div class="label bold-content-text">
                    Report to
                    <div @click="copyLink('secretary-value')">
                      <i class="icon fa-regular fa-copy"></i>
                    </div>
                  </div>
                  <div class="content-text" id="secretary-value">
                    {{ secretary }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
        <transition
          name="route"
          v-if="isAddExecutive == true || getExecutivesList.length == 0"
        >
          <form
            @submit.prevent="handleChangeExecutive"
            class="add-executive-card"
          >
            <div class="image-profile-upload">
              <label class="upload-profile" for="upload">
                <input
                  @change="uploadImage"
                  type="file"
                  accept="image/*"
                  id="upload"
                  name="upload"
                />
                <div class="upload-button">
                  <i class="icon fa-solid fa-arrow-up-from-bracket"></i>
                </div>
                <div
                  v-if="editId == ''"
                  :class="`${
                    previewImage == '' ? 'profile-image' : 'preview-img'
                  }`"
                >
                  <img
                    v-if="previewImage == ''"
                    src="../../assets/decorations/sample_profile.png"
                    alt="sample profile illustration"
                  />
                  <img :src="previewImage" alt="" v-if="previewImage" />
                </div>
                <div
                  v-else
                  :class="`${
                    previewImage == '' && form.imageProfile == ''
                      ? 'profile-image'
                      : 'preview-img'
                  }`"
                >
                  <img
                    v-if="previewImage == '' && realImage == ''"
                    src="../../assets/decorations/sample_profile.png"
                    alt="sample profile illustration"
                  />
                  <img
                    :src="previewImage"
                    alt=""
                    v-if="previewImage && realImage == ''"
                  />
                  <img
                    :src="urlImage + '/' + realImage"
                    alt=""
                    v-if="realImage"
                  />
                </div>
              </label>
              <div
                class="delete-button"
                @click="deleteImage"
                v-if="form.imageProfile"
              >
                <i class="icon fa-solid fa-xmark"></i>
              </div>
            </div>

            <div class="information">
              <div class="input">
                <div class="input-form">
                  <label for="title" class="bold-small-text"
                    >Title<span class="required"
                      >* {{ errors.title }}</span
                    ></label
                  >
                  <select name="title" id="title" v-model="form.title">
                    <option value="">none</option>
                    <option
                      v-for="(title, index) in getterExecutiveTitles"
                      :key="title"
                      :value="index"
                    >
                      {{ title }}
                    </option>
                  </select>
                </div>
                <div class="input-form">
                  <label for="name" class="bold-small-text"
                    >Name<span class="required"
                      >* {{ errors.firstname }}</span
                    ></label
                  >
                  <input
                    class="small-text"
                    type="text"
                    placeholder="Name"
                    id="name"
                    name="name"
                    v-model="form.firstname"
                  />
                </div>
              </div>
              <div class="input">
                <div class="input-form">
                  <label for="surname" class="bold-small-text"
                    >Surname<span class="required"
                      >* {{ errors.lastname }}</span
                    ></label
                  >
                  <input
                    class="small-text"
                    type="text"
                    placeholder="Surname"
                    id="surname"
                    name="surname"
                    v-model="form.lastname"
                  />
                </div>
                <div class="input-form">
                  <label for="position" class="bold-small-text"
                    >Position<span class="required"
                      >* {{ errors.position }}</span
                    ></label
                  >
                  <select name="position" id="position" v-model="form.position">
                    <option value="">none</option>
                    <option
                      v-for="(position, index) in getterExecutivePositions"
                      :key="position"
                      :value="index"
                    >
                      {{ position }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="input">
                <div class="input-form">
                  <label for="email" class="bold-small-text"
                    >Email<span class="required"
                      >* {{ errors.email }} {{ errors.uniqueEmail }}</span
                    ></label
                  >
                  <input
                    class="small-text"
                    type="text"
                    placeholder="Email"
                    id="email"
                    name="email"
                    v-model="form.email"
                  />
                </div>
                <div class="input-form">
                  <label for="phone-number" class="bold-small-text"
                    >Phone number<span class="required"
                      >* {{ errors.tel }} {{ errors.uniqueTel }}</span
                    ></label
                  >
                  <input
                    class="small-text"
                    type="tel"
                    placeholder="e.g. 0810000000"
                    id="phone-number"
                    name="phone-number"
                    v-model="form.tel"
                  />
                </div>
              </div>
              <div class="input">
                <div class="input-form">
                  <label for="secretary" class="bold-small-text"
                    >Report to</label
                  >
                  <input
                    class="small-text"
                    type="text"
                    placeholder="report to"
                    id="secretary"
                    name="secretary"
                    :value="secretary"
                    readonly
                  />
                </div>
                <div :style="{ width: '100%' }"></div>
              </div>
              <div class="form-button">
                <BaseButton
                  v-if="getExecutivesList.length != 0"
                  buttonType="outlined-button"
                  btnText="Cancel"
                  textColor="#F33C3C"
                  textHover="white"
                  color="#F33C3C"
                  hoverColor="#F33C3C"
                  @onClick="cancelEdit"
                >
                </BaseButton>
                <div v-else :style="{ width: '100%' }"></div>
                <BaseButton
                  buttonType="common-button"
                  btnText="Create executive"
                  textColor="white"
                  textHover="white"
                  color="#7452FF"
                  hoverColor="#23106D"
                  width="25rem"
                  type="submit"
                  v-if="!editId"
                >
                </BaseButton>
                <BaseButton
                  buttonType="common-button"
                  btnText="Edit executive"
                  textColor="white"
                  textHover="white"
                  color="#7452FF"
                  hoverColor="#23106D"
                  width="25rem"
                  type="submit"
                  v-else
                >
                </BaseButton>
              </div>
            </div>
          </form>
        </transition>
      </div>
    </div>
    <BasePopup
      v-if="isShowPopup"
      @closeModal="isShowPopup = false"
      :selectedExecutive="selectedExecutive"
      :image="require(`@/assets/decorations/delete_executive.png`)"
    >
      <template v-slot:popupContent>
        This executive(<span :style="{ color: '#C4C4C4 !important' }">{{
          selectedExecutive.first_name
        }}</span
        >) will be deleted immediately after confirming!
      </template>
      <template v-slot:buttons>
        <BaseButton
          buttonType="common-button"
          btnText="Confirm delete"
          textColor="white"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="deleteExecutive(selectedId)"
        >
        </BaseButton>
        <BaseButton
          buttonType="outlined-button"
          btnText="Cancel"
          textColor="#F33C3C"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="isShowPopup = false"
        >
        </BaseButton>
      </template>
    </BasePopup>
  </div>
</template>

<script>
import BaseButton from "../../components/UI/BaseButton.vue";
import BaseHeader from "../../components/UI/BaseHeader.vue";
import BasePopup from "../../components/UI/BasePopup.vue";
import ExecutiveComp from "../../components/meeting/ExecutiveComp.vue";
import jwtDecrypt from "../../helpers/jwtHelper";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { BaseButton, BaseHeader, ExecutiveComp, BasePopup },
  name: "ExecutiveView",
  props: ["isAdd", "showIndex"],
  data() {
    return {
      urlImage: this.$store.state.imageURL,
      isLoading: false,
      secretary: "",
      isAddExecutive: false,
      isShowPopup: false,
      searchInput: "",
      selectedExecutive: null,
      selectedId: null,
      isShowDropdown: false,
      editId: "",
      previewImage: "",
      realImage: "",
      form: {
        title: "",
        firstname: "",
        lastname: "",
        position: "",
        email: "",
        tel: "",
        imageProfile: null,
      },
      errors: {},
    };
  },
  computed: {
    ...mapGetters([
      "getterExecutives",
      "getterMyExecutives",
      "getterLoadingStatus",
      "getterExecutiveTitles",
      "getterExecutivePositions",
    ]),
    getExecutivesList() {
      return this.$store.getters.getterMyExecutives;
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
    titleIsValid() {
      return !!this.form.title;
    },
    firstnameIsValid() {
      return !!this.form.firstname;
    },
    lastnameIsValid() {
      return !!this.form.lastname;
    },
    positionIsValid() {
      return !!this.form.position;
    },
    emailIsValid() {
      return !!this.form.email;
    },
    telIsValid() {
      return !!this.form.tel;
    },
    telPatternIsValid() {
      return (
        !!(this.form.tel.length == 10) && !!this.form.tel.match(/^[0-9]+$/)
      );
    },
    checkUniqueEmail() {
      for (let index = 0; index < this.getterExecutives.length; index++) {
        if (
          this.getterExecutives[index].email == this.form.email &&
          this.getterExecutives[index].id != this.editId
        ) {
          return true;
        }
      }
      return false;
    },
    checkUniqueTel() {
      for (let index = 0; index < this.getterExecutives.length; index++) {
        if (
          this.getterExecutives[index].phone_number == this.form.tel &&
          this.getterExecutives[index].id != this.editId
        ) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    ...mapActions([
      "getExecutives",
      "getMyExecutives",
      "getExecutiveTitle",
      "getExecutivePosition",
    ]),
    formatPhoneNumber(str) {
      let cleaned = ("" + str).replace(/\D/g, "");
      let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

      if (match) {
        return match[1] + "-" + match[2] + "-" + match[3];
      }
      return null;
    },
    formatTitle(str) {
      return this.getterExecutiveTitles[str];
    },
    formatPosition(str) {
      return this.getterExecutivePositions[str];
    },
    selectExecutive(id) {
      this.cancelEdit();
      this.selectedExecutive = this.getExecutivesList.find((executive) => {
        this.selectedId = id;
        return executive.id == id;
      });
    },
    copyLink(value) {
      let copyText = document.getElementById(value).innerHTML;
      navigator.clipboard.writeText(copyText);
    },
    toggleDropDown() {
      this.isShowDropdown = !this.isShowDropdown;
    },
    togglePopup() {
      this.isShowPopup = true;
    },
    deleteImage() {
      this.realImage = "";
      this.previewImage = "";
      this.form.imageProfile = "";
    },
    handleAdd() {
      this.searchInput = "";
      this.isAddExecutive = true;
      this.editId = "";
      this.form.title = "";
      this.form.firstname = "";
      this.form.lastname = "";
      this.form.email = "";
      this.form.position = "";
      this.form.tel = "";
      this.form.imageProfile = "";
      this.previewImage = "";
      this.errors = {};
    },
    cancelEdit() {
      this.isAddExecutive = false;
      this.editId = "";
      this.form.title = "";
      this.form.firstname = "";
      this.form.lastname = "";
      this.form.email = "";
      this.form.position = "";
      this.form.tel = "";
      this.form.imageProfile = "";
      this.previewImage = "";
      this.errors = {};
    },
    editExecutive(id) {
      this.searchInput = "";
      this.isAddExecutive = true;
      this.editId = id;
      this.previewImage = "";
      this.form.title = this.selectedExecutive.title_code;
      this.form.firstname = this.selectedExecutive.first_name;
      this.form.lastname = this.selectedExecutive.last_name;
      this.form.email = this.selectedExecutive.email;
      this.form.position = this.selectedExecutive.position;
      this.form.tel = this.selectedExecutive.phone_number;
      this.form.imageProfile =
        this.selectedExecutive.img_profile == "default_profile.png"
          ? null
          : this.selectedExecutive.img_profile;
      this.realImage = this.selectedExecutive.img_profile;
      console.log(this.form);
    },
    uploadImage(e) {
      if (e.target.files.length != 0) {
        this.previewImage = "";
        this.realImage = "";
        const image = e.target.files[0];
        this.form.imageProfile = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        e.target.value = "";
      }
    },
    handleChangeExecutive() {
      this.titleIsValid
        ? delete this.errors.title
        : (this.errors.title = "Please select title");
      this.firstnameIsValid
        ? delete this.errors.firstname
        : (this.errors.firstname = "Please inform firstname");
      this.lastnameIsValid
        ? delete this.errors.lastname
        : (this.errors.lastname = "Please inform lastname");
      this.positionIsValid
        ? delete this.errors.position
        : (this.errors.position = "Please select position");
      this.emailIsValid
        ? delete this.errors.email
        : (this.errors.email = "Please inform email");
      if (this.telIsValid) {
        delete this.errors.tel;
        if (this.telPatternIsValid) {
          delete this.errors.tel;
        } else {
          this.errors.tel = "Phone number is not valid";
        }
      } else {
        this.errors.tel = "Please inform phone number";
      }
      this.checkUniqueEmail == false
        ? delete this.errors.uniqueEmail
        : (this.errors.uniqueEmail = "This email has already registered");
      this.checkUniqueTel == false
        ? delete this.errors.uniqueTel
        : (this.errors.uniqueTel = "This phone number has already registered");
      if (Object.keys(this.errors).length == 0) {
        const newExecutive = {
          title_code: this.form.title,
          first_name: this.form.firstname,
          last_name: this.form.lastname,
          position: this.form.position,
          phone_number: this.form.tel,
          email: this.form.email,
        };
        this.editId
          ? (this.$store.dispatch("editExecutive", {
              editExecutive: newExecutive,
              id: this.editId,
              img_profile: this.form.imageProfile
                ? this.form.imageProfile
                : null,
            }),
            (this.isLoading = true),
            /* eslint-disable */
            setTimeout(
              () => (
                (this.selectedExecutive = this.getExecutivesList.find(
                  (executive) => {
                    return executive.id == this.editId;
                  }
                )),
                (this.selectedId = this.editId),
                (this.isLoading = false)
              ),
              1000
            ),
            (this.isAddExecutive = false))
          : (this.$store.dispatch(
              "addExecutive",
              {
                newExecutive: newExecutive,
                img_profile: this.form.imageProfile
                  ? this.form.imageProfile
                  : null,
              },
              this.cancelEdit(),
              (this.isLoading = true)
            ),
            setTimeout(
              () => (
                (this.selectedExecutive = this.getExecutivesList[0]),
                (this.selectedId = this.getExecutivesList[0].id),
                (this.isLoading = false)
              ),
              1000
            ));
      }
    },
    deleteExecutive(id) {
      this.isShowDropdown = false;
      this.$store.dispatch("deleteExecutive", id);
      this.isShowPopup = false;
      setTimeout(
        () =>
          this.getExecutivesList.length != 0
            ? ((this.selectedExecutive = this.getExecutivesList[0]),
              (this.selectedId = this.getExecutivesList[0].id))
            : (this.isAddExecutive = true),
        1000
      );
    },
  },
  created() {
    this.getExecutives();
    this.getMyExecutives();
    this.getExecutiveTitle();
    this.getExecutivePosition();
  },
  watch: {
    getExecutivesList: function () {
      if (this.getExecutivesList.length > 0) {
        this.showIndex
          ? ((this.selectedExecutive = this.getExecutivesList[this.showIndex]),
            (this.selectedId = this.getExecutivesList[this.showIndex].id))
          : ((this.selectedExecutive = this.getExecutivesList[0]),
            (this.selectedId = this.getExecutivesList[0].id));
      }
    },
  },
  mounted() {
    if (localStorage.getItem("user")) {
      this.secretary = `${
        jwtDecrypt(localStorage.getItem("user")).title_code
      }. ${jwtDecrypt(localStorage.getItem("user")).first_name} ${
        jwtDecrypt(localStorage.getItem("user")).last_name
      } (${jwtDecrypt(localStorage.getItem("user")).email})`;
    }
    window.onscroll = () => {
      this.isShowDropdown = false;
    };
    this.isAddExecutive = this.isAdd ? true : this.isAddExecutive;
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
.required {
  color: $error;
  margin-left: 0.2rem;
  font-size: 1.4rem !important;
}
.executive-screen {
  .body {
    padding: 3rem;
    .first-body-section {
      grid-template-columns: 1fr 2fr;
      column-gap: 3rem;
      .filter-executive {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
        position: relative;
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
          height: 64rem;
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
      .container {
        width: 100%;
        height: 100%;
        border-radius: 2.5rem;
        background-color: $white;
        padding: 5.4rem 6.4rem;
        position: relative;
        .loading {
          color: $darkGrey;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          animation-name: floating;
          -webkit-animation-name: floating;
          animation-duration: 3s;
          -webkit-animation-duration: 3s;
          animation-iteration-count: infinite;
          -webkit-animation-iteration-count: infinite;
        }
        .icon-dropdown {
          position: absolute;
          top: 5.4rem;
          right: 6.4rem;
          font-size: 2.2rem;
          color: $darkViolet;
          z-index: 10;
          cursor: pointer;
          transition: 0.2s all ease-in-out;
        }
        .icon-dropdown:hover {
          color: $primaryViolet;
        }
        .dropdown__content {
          box-shadow: 0px 0px 5px $fadedViolet;
          z-index: -1;
          display: flex;
          text-align: center;
          justify-content: center;
          align-items: center;
          margin-top: 1rem;
          position: absolute;
          opacity: 0;
          background-color: $white;
          overflow: hidden;
          padding: 2.8rem 3.6rem;
          right: 6.4rem;
          transition: 0.3s all ease-in-out;
          border-radius: 1.5rem;
          cursor: auto;

          &.is-show {
            transform: translateY(2rem);
            opacity: 1;
            z-index: 1;
            cursor: pointer;
          }
          ul {
            width: 100%;
            list-style: none;
            li {
              color: $darkViolet;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: 0.3s all ease-in-out;
              .icon {
                font-size: 1.4rem;
                margin-right: 1rem;
                transition: 0.3s all ease-in-out;
              }
              .line {
                width: 100% !important;
                margin: 1.5rem 0;
                height: 0.1rem;
                background-color: $grey;
              }
            }
            li:hover {
              color: $primaryViolet;
              .icon {
                color: $primaryViolet !important;
              }
            }
            li.red-color:hover {
              color: $error;
              .icon {
                color: $error !important;
              }
            }
          }
        }
      }
      .executive-card {
        grid-template-columns: 0.65fr 1.35fr;
        column-gap: 2.4rem;
        position: relative;
        .left-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          row-gap: 1.2rem;
          .real-profile-image {
            border-radius: 2rem;
            width: 14rem;
            height: 14rem;
            background-color: $fadedViolet;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .profile-image {
            border-radius: 2rem;
            width: 14rem;
            height: 14rem;
            background-color: $fadedViolet;
            padding: 2.4rem;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .executive-profile {
            display: flex;
            flex-direction: column;
            row-gap: 0.6rem;
            .name {
              color: $darkViolet;
            }
            .position {
              line-height: 1.4;
              color: $highlightViolet;
            }
          }
        }
        .right-side {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          row-gap: 3rem;
          .title {
            color: $darkGrey;
          }
          .email,
          .phone,
          .secretary {
            display: flex;
            flex-direction: column;
            row-gap: 1.2rem;
            .label {
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
            .content-text {
              color: $primaryViolet;
            }
          }
        }
      }
      .add-executive-card {
        width: 100%;
        height: 100%;
        border-radius: 2.5rem;
        background-color: $white;
        padding: 5.4rem 6.4rem;
        display: grid;
        grid-template-rows: 1fr 1.5fr;
        justify-items: center;
        align-items: center;
        .image-profile-upload {
          position: relative;
          .delete-button {
            cursor: pointer;
            top: 0%;
            right: 0%;
            transform: translateX(1rem) translateY(-1rem);
            position: absolute;
            background-color: $error;
            border-radius: 1rem;
            padding: 1rem 1.2rem;
            transition: 0.2s all ease-in-out;
            &:hover {
              background-color: $errorHover;
            }
            .icon {
              font-size: 1.4rem;
              color: $white;
            }
          }
        }

        .upload-profile {
          cursor: pointer;
          width: fit-content;
          height: fit-content;
          position: relative;
          input {
            display: none;
          }
          .upload-button {
            bottom: 0%;
            right: 0%;
            transform: translateX(1rem) translateY(1rem);
            position: absolute;
            background-color: $primaryViolet;
            border-radius: 1rem;
            padding: 1rem;
            .icon {
              font-size: 1.4rem;
              color: $white;
            }
          }
          .profile-image {
            border-radius: 2rem;
            width: 14rem;
            height: 14rem;
            background-color: $fadedViolet;
            padding: 2.4rem;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .preview-img {
            border-radius: 2rem;
            width: 14rem;
            height: 14rem;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
        .information {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          .input {
            display: flex;
            gap: 5rem;
            .input-form {
              width: 100%;
              display: flex;
              flex-direction: column;
              select,
              input[type="text"],
              input[type="tel"] {
                margin-top: 1rem;
                padding: 1rem 1.4rem;
                width: 100%;
                height: 4rem;
                border-radius: 0.5rem;
                border: none;
                background-color: $primaryGrey;
                font-family: "Poppins", sans-serif;
              }
              input[type="text"]:focus,
              input[type="tel"]:focus {
                outline: none;
                border: 0.1rem solid $primaryViolet;
              }
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
          .form-button {
            width: 100%;
            justify-content: flex-end;
            display: flex;
            gap: 1.5rem;
          }
        }
      }
    }
  }
}
</style>
