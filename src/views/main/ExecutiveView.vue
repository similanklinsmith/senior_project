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
        @onClick="isAddExecutive = true"
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
              filterByName.length >= 4
                ? { overflowY: 'scroll' }
                : { overflow: 'hidden' }
            "
          >
            <transition-group name="route">
              <ExecutiveComp
                v-for="(executive, index) in filterByName"
                :key="index"
                @selectExecutive="selectExecutive"
                :executive="executive"
                :selectedId="selectedId"
              />
              <div
                v-if="filterByName.length == 0"
                class="remark-text not-found"
              >
                Not found
              </div>
            </transition-group>
          </div>
        </div>
        <transition-group name="route">
          <div
            class="executive-card grid"
            v-if="executives.length > 0 && isAddExecutive == false"
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
            <div class="left-side">
              <div class="profile-image">
                <img
                  src="../../assets/decorations/sample_profile.png"
                  alt="sample profile illustration"
                />
              </div>
              <div class="executive-profile">
                <div class="name remark-text">
                  {{ selectedExecutive.title }}.
                  {{ selectedExecutive.firstname }}
                  {{ selectedExecutive.lastname }}
                </div>
                <div class="position thin-content-text">
                  {{ selectedExecutive.position }}
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
                  {{ selectedExecutive.email }}
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
                  {{ selectedExecutive.tel }}
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
                  {{ selectedExecutive.reportTo }}
                </div>
              </div>
            </div>
          </div>
        </transition-group>
        <transition
          name="route"
          v-if="isAddExecutive == true || executives.length == 0"
        >
          <div class="add-executive-card">
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
                :class="`${
                  previewImage == '' ? 'profile-image' : 'preview-img'
                }`"
              >
                <img
                  v-if="previewImage == ''"
                  src="../../assets/decorations/sample_profile.png"
                  alt="sample profile illustration"
                />
                <img :src="previewImage" alt="" v-else />
              </div>
            </label>
            <div class="information">
              <div class="input">
                <div class="input-form">
                  <label for="title" class="bold-small-text">Title</label>
                  <select name="title" id="title">
                    <option value="">none</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                    <option value="Professor">Professor</option>
                    <option value="othes">others</option>
                  </select>
                </div>
                <div class="input-form">
                  <label for="name" class="bold-small-text">Name</label>
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
                  <label for="surname" class="bold-small-text">Surname</label>
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
                  <label for="position" class="bold-small-text">Position</label>
                  <select name="position" id="position">
                    <option value="">none</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                    <option value="Professor">Professor</option>
                    <option value="othes">others</option>
                  </select>
                </div>
              </div>
              <div class="input">
                <div class="input-form">
                  <label for="email" class="bold-small-text">Email</label>
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
                    >Phone number</label
                  >
                  <input
                    class="small-text"
                    type="text"
                    placeholder="e.g. 000-000-0000"
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
                    v-model="form.reportTo"
                  />
                </div>
                <div :style="{ width: '100%' }"></div>
              </div>
              <div class="form-button">
                <BaseButton
                  v-if="executives.length != 0"
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
                >
                </BaseButton>
              </div>
            </div>
          </div>
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
          selectedExecutive.firstname
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
import { mapGetters, mapActions } from "vuex";
export default {
  components: { BaseButton, BaseHeader, ExecutiveComp, BasePopup },
  name: "ExecutiveView",
  data() {
    return {
      isAddExecutive: false,
      isShowPopup: false,
      searchInput: "",
      selectedExecutive: null,
      selectedId: null,
      executives: [],
      isShowDropdown: false,
      editId: "",
      previewImage: "",
      form: {
        title: "",
        firstname: "",
        lastname: "",
        position: null,
        email: "",
        tel: "",
        reportTo: "",
        imageProfile: "",
      },
    };
  },
  // eslint-disable-next-line
  computed: mapGetters(["getExecutives"]),
  // eslint-disable-next-line
  computed: {
    getExecutivesList() {
      console.log(this.$store.getters.getExecutives);
      return this.$store.getters.getExecutives;
    },
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
    ...mapActions(["getExecutives"]),
    selectExecutive(id) {
      this.selectedExecutive = this.executives.find((executive) => {
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
    cancelEdit() {
      this.isAddExecutive = false;
      this.editId = "";
      // this.form.title = "";
      this.form.firstname = "";
      this.form.lastname = "";
      this.form.email = "";
      // this.form.position = "";
      this.form.tel = "";
      this.form.reportTo = "";
      // this.form.imageProfile = "";
    },
    editExecutive(id) {
      this.isAddExecutive = true;
      this.editId = id;
      // this.form.title = this.selectedExecutive.title;
      this.form.firstname = this.selectedExecutive.firstname;
      this.form.lastname = this.selectedExecutive.lastname;
      this.form.email = this.selectedExecutive.email;
      // this.form.position = this.selectedExecutive.position;
      this.form.tel = this.selectedExecutive.tel;
      this.form.reportTo = this.selectedExecutive.reportTo;
      // this.form.imageProfile = this.selectedExecutive.imageProfile;
    },
    uploadImage(e) {
      const image = e.target.files[0];
      this.form.imageProfile = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
    },
  },
  created() {
    this.getExecutives();
  },
  mounted() {
    window.onscroll = () => {
      this.isShowDropdown = false;
    };
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
    if (this.executives.length > 0) {
      this.selectedExecutive = this.executives[0];
      this.selectedId = this.executives[0].id;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors/webColors.scss";
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
      .executive-card {
        width: 100%;
        height: 100%;
        border-radius: 2.5rem;
        background-color: $white;
        padding: 5.4rem 6.4rem;
        grid-template-columns: 0.65fr 1.35fr;
        column-gap: 2.4rem;
        position: relative;
        .icon-dropdown {
          position: absolute;
          top: 5.4rem;
          right: 6.4rem;
          font-size: 2.2rem;
          color: $darkViolet;
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
          margin-top: 6rem;
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
        .left-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          row-gap: 1.2rem;
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
            width: 80%;
            margin-left: 20%;
            display: flex;
            gap: 1.5rem;
          }
        }
      }
    }
  }
}
</style>
