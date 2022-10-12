<template>
  <div class="executive-screen">
    <BaseHeader
      :headerText="text['executive']['header']"
      :contentText="text['executive']['subHeader']"
    >
      <BaseButton
        class="laptop"
        buttonType="common-button"
        :btnText="text['executive']['addExecutive']"
        textColor="#23106D"
        textHover="white"
        color="#DBD2FF"
        hoverColor="#23106D"
        @onClick="handleAdd"
        width="22rem"
      >
      </BaseButton>
    </BaseHeader>
    <div class="body">
      <div class="first-body-section grid">
        <div class="filter-executive laptop">
          <div class="search-filter">
            <div class="input-icon">
              <i class="icon fa-solid fa-magnifying-glass"></i>
              <input
                id="search-input-executive"
                class="small-text"
                type="text"
                :placeholder="text['executive']['placeholder']"
                v-model="searchInput"
                @focus="onFocus"
                @blur="onBlur"
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
                {{text['executive']['notFound']}}
              </div>
            </transition-group>
            <div
              v-if="getterLoadingStatus"
              class="remark-text not-found loading"
            >
              {{text['executive']['loading']}}
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
              @mouseleave="isShowDropdown = false"
            >
              <ul>
                <li @click="editExecutive(selectedExecutive.id)">
                  <div class="icon-container">
                    <i class="icon fa-solid fa-pencil"></i>
                  </div>
                  <div class="thin-content-text">{{text['executive']['editDropdown']}}</div>
                </li>
                <li><div class="line" /></li>
                <li class="red-color" @click="isShowPopup = true">
                  <div class="icon-container-red">
                    <i class="icon fa-solid fa-user-minus"></i>
                  </div>
                  <div class="thin-content-text">{{text['executive']['deleteDropdown']}}</div>
                </li>
              </ul>
            </div>
            <div v-if="isLoading" class="remark-text loading">{{text['executive']['loading']}}</div>
            <div class="executive-card grid" v-if="isLoading == false">
              <div class="left-side">
                <div
                  class="real-profile-image"
                  v-if="selectedExecutive?.img_profile != 'default_profile.png'"
                >
                  <img
                    :src="urlImage + '/' + selectedExecutive?.img_profile"
                    alt="profile of user"
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
                <div class="content-text title">{{text['executive']['information']}}</div>
                <div class="email">
                  <div class="label bold-content-text">
                    {{text['executive']['email']}}
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
                    {{text['executive']['phone']}}
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
                    {{text['executive']['reportTo']}}
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
                    src="@/assets/decorations/sample_profile.png"
                    alt="sample profile illustration"
                  />
                  <img
                    :src="previewImage"
                    alt="preview profile"
                    v-if="previewImage"
                  />
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
                    src="@/assets/decorations/sample_profile.png"
                    alt="sample profile illustration"
                  />
                  <img
                    :src="previewImage"
                    alt="preview profile of user"
                    v-if="previewImage && realImage == ''"
                  />
                  <img
                    :src="urlImage + '/' + realImage"
                    alt="profile of user"
                    v-if="realImage"
                    @error="
                      $event.target.src =
                        'http://www.grand-cordel.com/wp-content/uploads/2015/08/import_placeholder.png'
                    "
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
                    >{{text['executive']['title']}}<span class="required"
                      >*</span
                    ></label
                  >
                  <select name="title" id="title" v-model="form.title">
                    <option value="">{{text['input']['none']}}</option>
                    <option
                      v-for="(title, index) in getterExecutiveTitles"
                      :key="title"
                      :value="index"
                    >
                      {{ title }}
                    </option>
                  </select>
                  <div class="bold-small-text required">{{ errors.title }}</div>
                </div>
                <div class="input-form">
                  <label for="name" class="bold-small-text"
                    >{{text['executive']['name']}}<span class="required"
                      >*</span
                    ></label
                  >
                  <input
                    class="small-text"
                    type="text"
                    :placeholder="text['executive']['name']"
                    id="name"
                    name="name"
                    @keydown.space.prevent
                    v-model.trim="form.firstname"
                  />
                  <div class="bold-small-text required">{{ errors.firstname }}</div>
                </div>
              </div>
              <div class="input">
                <div class="input-form">
                  <label for="surname" class="bold-small-text"
                    >{{text['executive']['surname']}}<span class="required"
                      >*</span
                    ></label
                  >
                  <input
                    class="small-text"
                    type="text"
                    :placeholder="text['executive']['surname']"
                    id="surname"
                    name="surname"
                    @keydown.space.prevent
                    v-model.trim="form.lastname"
                  />
                  <div class="bold-small-text required">{{ errors.lastname }}</div>
                </div>
                <div class="input-form">
                  <label for="position" class="bold-small-text"
                    >{{text['executive']['position']}}<span class="required"
                      >*</span
                    ></label
                  >
                  <select name="position" id="position" v-model="form.position">
                    <option value="">{{text['input']['none']}}</option>
                    <option
                      v-for="(position, index) in getterExecutivePositions"
                      :key="position"
                      :value="index"
                    >
                      {{ position }}
                    </option>
                  </select>
                  <div class="bold-small-text required">{{ errors.position }}</div>
                </div>
              </div>
              <div class="input">
                <div class="input-form">
                  <label for="email" class="bold-small-text"
                    >{{text['executive']['email']}}<span class="required"
                      >*</span
                    ></label
                  >
                  <input
                    class="small-text"
                    type="text"
                    :placeholder="text['executive']['email']"
                    id="email"
                    name="email"
                    @keydown.space.prevent
                    v-model.trim="form.email"
                  />
                  <div class="bold-small-text required">{{ errors.email }} {{ errors.uniqueEmail }}</div>
                </div>
                <div class="input-form">
                  <label for="phone-number" class="bold-small-text"
                    >{{text['executive']['phone']}}<span class="required"
                      >*</span
                    ></label
                  >
                  <input
                    class="small-text"
                    type="tel"
                    placeholder="e.g. 0810000000"
                    id="phone-number"
                    name="phone-number"
                    @keydown.space.prevent
                    v-model.trim="form.tel"
                  />
                  <div class="bold-small-text required">{{ errors.tel }} {{ errors.uniqueTel}} </div>
                </div>
              </div>
              <div class="input">
                <div class="input-form">
                  <label for="secretary" class="bold-small-text"
                    >{{text['executive']['reportTo']}}</label
                  >
                  <input
                    class="small-text readonly"
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
                  :btnText="text['executive']['cancel']"
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
                  :btnText="text['executive']['createExecutive']"
                  textColor="white"
                  textHover="white"
                  color="#7452FF"
                  hoverColor="#23106D"
                  type="submit"
                  v-if="!editId"
                >
                </BaseButton>
                <BaseButton
                  buttonType="common-button"
                  :btnText="text['executive']['editDropdown']"
                  textColor="white"
                  textHover="white"
                  color="#7452FF"
                  hoverColor="#23106D"
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
      @closeModal="isShowPopup = false, isShowDropdown = false"
      :image="require(`@/assets/decorations/delete_executive.png`)"
    >
      <template v-slot:popupContent>
        {{text['executive']['preDeleteText']}}(<span :style="{ color: '#C4C4C4 !important' }">{{
          selectedExecutive.first_name
        }}</span
        >) {{text['executive']['postDeleteText']}}
      </template>
      <template v-slot:buttons>
        <BaseButton
          buttonType="common-button"
          :btnText="text['executive']['confirmDelete']"
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
          :btnText="text['executive']['cancel']"
          textColor="#F33C3C"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="isShowPopup = false, isShowDropdown = false"
        >
        </BaseButton>
      </template>
    </BasePopup>
    <BasePopup
      v-if="isShowSizeError"
      @closeModal="isShowSizeError = false"
      :image="require(`@/assets/decorations/not_found.png`)"
    >
      <template v-slot:popupContent>
        {{text['executive']['fileSizeError']}}
      </template>
      <template v-slot:buttons>
        <BaseButton
          buttonType="common-button"
          :btnText="text['executive']['okay']"
          textColor="white"
          textHover="white"
          color="#F33C3C"
          hoverColor="#d93333"
          width="100%"
          @onClick="isShowSizeError = false"
        >
        </BaseButton>
      </template>
    </BasePopup>
    <BaseAlert v-if="getterFailed" :status="`failed`">
      {{text['executive']['errorAction']}}
    </BaseAlert>
    <BaseExecutivesPopup
      :executives="getExecutivesList"
      :selectedId="selectedId"
      v-if="isSearchMobile"
      @onClickCloseSearch="isSearchMobile = false"
      @onClickSelectExecutive="selectExecutive"
    />
    <div class="mobile-button-actions" v-if="getExecutivesList.length != 0">
      <div class="mobile-button" @click="handleAdd" v-if="!isAddExecutive">
        <i class="fa-solid fa-user-plus"></i>
      </div>
      <div
        class="mobile-button-search"
        v-if="!isAddExecutive"
        @click="isSearchMobile = true"
      >
        <div class="number-of-executive">
          <div class="bold-small-text">{{ getExecutivesList.length }}</div>
        </div>
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseHeader from "@/components/UI/BaseHeader.vue";
import BasePopup from "@/components/UI/BasePopup.vue";
import BaseExecutivesPopup from "@/components/UI/BaseExecutivesPopup.vue";
import BaseAlert from "@/components/UI/BaseAlert.vue";
import ExecutiveComp from "@/components/meeting/ExecutiveComp.vue";
import jwtDecrypt from "@/helpers/jwtHelper";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    BaseButton,
    BaseHeader,
    ExecutiveComp,
    BasePopup,
    BaseAlert,
    BaseExecutivesPopup,
  },
  name: "ExecutiveView",
  props: ["isAdd", "showIndex"],
  data() {
    return {
      text: null,
      lang: null,
      isSearchMobile: false,
      urlImage: this.$store.state.imageURL,
      isLoading: false,
      secretary: "",
      isAddExecutive: false,
      isShowPopup: false,
      isShowSizeError: false,
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
      "getterFailed",
      "getterExecutives",
      "getterMyExecutives",
      "getterLoadingStatus",
      "getterExecutiveTitles",
      "getterExecutivePositions",
    ]),
    getExecutivesList() {return this.$store.getters.getterMyExecutives;},
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
    titleIsValid() {return !!this.form.title;},
    firstnameIsValid() {return !!this.form.firstname;},
    lastnameIsValid() {return !!this.form.lastname;},
    positionIsValid() {return !!this.form.position;},
    emailIsValid() {return !!this.form.email;},
    telIsValid() {return !!this.form.tel;},
    telPatternIsValid() {return (!!this.form.tel.match(/^[0-9]+$/) && !!(this.form.tel.length == 10 || this.form.tel.length == 9));},
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
    onFocus() {document.getElementById("search-input-executive").placeholder = this.text['executive']['focusSearch'];},
    onBlur() {document.getElementById("search-input-executive").placeholder = this.text['executive']['placeholder'];},
    formatPhoneNumber(str) {
      let cleaned = ("" + str).replace(/\D/g, "");
      let match = cleaned.length == 10 ? cleaned.match(/^(\d{3})(\d{3})(\d{4})$/) : cleaned.match(/^(\d{2})(\d{3})(\d{4})$/);
      if (match) {return match[1] + "-" + match[2] + "-" + match[3];}
      return null
    },
    formatTitle(str) {return this.getterExecutiveTitles[str];},
    formatPosition(str) {return this.getterExecutivePositions[str];},
    selectExecutive(id) {
      this.isShowDropdown = false;
      this.isSearchMobile = false;
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
    toggleDropDown() {this.isShowDropdown = !this.isShowDropdown;},
    togglePopup() {this.isShowPopup = true;},
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
      this.isShowDropdown = false;
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
          ? ""
          : this.selectedExecutive.img_profile;
      this.realImage =
        this.selectedExecutive.img_profile == "default_profile.png"
          ? ""
          : this.selectedExecutive.img_profile;
    },
    uploadImage(e) {
      if (e.target.files[0].size < 1000000) {
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
      } else {
        this.isShowSizeError = true;
      }
    },
    async handleChangeExecutive() {
      this.titleIsValid
        ? delete this.errors.title
        : (this.errors.title = this.text['errors']['titleCode']);
      this.firstnameIsValid
        ? delete this.errors.firstname
        : (this.errors.firstname = this.text['errors']['name']);
      this.lastnameIsValid
        ? delete this.errors.lastname
        : (this.errors.lastname = this.text['errors']['lastname']);
      this.positionIsValid
        ? delete this.errors.position
        : (this.errors.position = this.text['errors']['position']);
      this.emailIsValid
        ? delete this.errors.email
        : (this.errors.email = this.text['errors']['email']);
      if (this.telIsValid) {
        delete this.errors.tel;
        if (this.telPatternIsValid) {
          delete this.errors.tel;
        } else {
          this.errors.tel = this.text['errors']['phoneNotValid'];
        }
      } else {
        this.errors.tel = this.text['errors']['phone'];
      }
      this.checkUniqueEmail == false
        ? delete this.errors.uniqueEmail
        : (this.errors.uniqueEmail = this.text['errors']['emailNotUnique']);
      this.checkUniqueTel == false
        ? delete this.errors.uniqueTel
        : (this.errors.uniqueTel = this.text['errors']['phoneNotUnique']);
      if (Object.keys(this.errors).length == 0) {
        const newExecutive = {
          title_code: this.form.title,
          first_name: this.form.firstname.replace(/(?:^|\s|-)\S/g, (x) =>
            x.toUpperCase()
          ),
          last_name: this.form.lastname.replace(/(?:^|\s|-)\S/g, (x) =>
            x.toUpperCase()
          ),
          position: this.form.position,
          phone_number: this.form.tel,
          email: this.form.email,
        };
        this.editId
          ? (await this.$store.dispatch("editExecutive", {
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
                (this.isLoading = false),
                (this.cancelEdit())
              ),
              1000
            ))
          : (await this.$store.dispatch(
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
    async deleteExecutive(id) {
      this.isShowDropdown = false;
      await this.$store.dispatch("deleteExecutive", id);
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
    window.scrollTo(0, 0);
    if (localStorage.getItem("user")) {
      this.secretary = `${
        jwtDecrypt(localStorage.getItem("user")).name
      } (${jwtDecrypt(localStorage.getItem("user")).email})`;
    }
    window.onscroll = () => {this.isShowDropdown = false;};
    this.isAddExecutive = this.isAdd ? true : this.isAddExecutive;
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
.mobile-button-actions {display: none;right: 0%;bottom: 0%;}
.mobile-button {justify-content: center;align-items: center;color: $white;font-size: 2rem;width: 6.4rem;height: 6.4rem;border-radius: 1rem;background-color: $primaryViolet;box-shadow: 1.8rem 1.8rem 1.3rem 0 #ababab4d;transform: translateX(-5rem) translateY(-5rem);}
.mobile-button-search {justify-content: center;align-items: center;color: $white;font-size: 2rem;width: 6.4rem;height: 6.4rem;border-radius: 1rem;background-color: $darkViolet;box-shadow: 1.8rem 1.8rem 1.3rem 0 #ababab4d;transform: translateX(-5rem) translateY(-5rem);position: relative;.number-of-executive {transform: translateX(1rem) translateY(-1rem);position: absolute;top: 0%;right: 0%;background-color: $error;width: 2.4rem;height: 2.4rem;border-radius: 50%;display: flex;align-items: center;justify-content: center;outline: 0.4rem solid $white;}}
.mobile-button:active,
.mobile-button-search:active {animation: press 0.2s 1 linear;}
.search-mobile-button {display: none;}
.required {color: $error;margin-top: 0.8rem;font-size: 1.4rem !important;}
.executive-screen {.body {padding: 3rem;.first-body-section {grid-template-columns: 1fr 2fr;column-gap: 3rem;.filter-executive {width: 100%;height: 100%;display: flex;flex-direction: column;row-gap: 1rem;position: relative;.search-filter {position: relative;width: 100%;display: flex;align-items: center;justify-items: center;.input-icon {width: 100%;display: flex;align-items: center;justify-items: center;input[type="text"] {padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $white;font-family: "Poppins", sans-serif;}input[type="text"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}.icon {position: absolute;right: 0;font-size: 1.4rem;margin-right: 1rem;color: $darkGrey;}}}.list-executive-card::-webkit-scrollbar {display: block !important;-ms-overflow-style: auto !important;scrollbar-width: auto !important;background-color: transparent;width: 1.4rem;}.list-executive-card::-webkit-scrollbar-track {margin: 1rem;border-radius: 0.5rem;}.list-executive-card::-webkit-scrollbar-thumb {background-color: $grey;border-radius: 0.5rem;transition: all 0.2s ease-in-out;}.list-executive-card::-webkit-scrollbar-thumb:hover {background-color: $darkGrey;}.list-executive-card {width: 100%;height: 64rem;border-radius: 1.5rem;background-color: $white;overflow: hidden;.not-found {padding: 1.8rem;width: 100%;display: flex;align-items: center;justify-content: center;height: 80%;text-align: center;color: $darkGrey;}.loading {animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}}}.container {animation-name: appearsBottom;animation-duration: 0.75s;animation-iteration-count: 1;width: 100% !important;height: 100%;border-radius: 2.5rem;background-color: $white;padding: 5.4rem 6.4rem;position: relative;.loading {color: $darkGrey;height: 100%;display: flex;justify-content: center;align-items: center;animation-name: floating;-webkit-animation-name: floating;animation-duration: 3s;-webkit-animation-duration: 3s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;}.icon-dropdown {position: absolute;top: 5.4rem;right: 6.4rem;font-size: 2.2rem;color: $darkViolet;z-index: 7;cursor: pointer;transition: 0.2s all ease-in-out;}.icon-dropdown:hover {color: $primaryViolet;}.dropdown__content {.icon-container,.icon-container-red{height: 3.6rem;margin-right: 1.6rem;width: 3.6rem;border-radius: 1rem;display: flex;justify-content: center;align-items: center;background-color: $fadedViolet;}.icon-container-red{background-color: $error;} box-shadow: 0px 0px 5px $fadedViolet;z-index: -1;display: flex;text-align: center;justify-content: center;align-items: center;margin-top: 1rem;position: absolute;opacity: 0;background-color: $white;overflow: hidden;padding: 2.8rem 3.6rem;right: 6.4rem;transition: 0.3s all ease-in-out;border-radius: 1.5rem;cursor: auto;&.is-show {transform: translateY(2rem);opacity: 1;z-index: 1;cursor: pointer;}ul {width: 100%;list-style: none;li {color: $darkViolet;display: flex;align-items: center;transition: 0.3s all ease-in-out;.icon {font-size: 1.4rem;transition: 0.3s all ease-in-out;}.line {width: 100% !important;margin: 1.5rem 0;height: 0.1rem;background-color: $grey;}}li:hover {color: $primaryViolet;.icon {color: $primaryViolet !important;}}li.red-color{.icon{color: $white;}}li.red-color:hover {color: $error;.icon {color: $white !important;}}}}}.executive-card {grid-template-columns: 0.65fr 1.35fr;column-gap: 2.4rem;position: relative;.left-side {display: flex;flex-direction: column;align-items: center;text-align: center;row-gap: 1.2rem;.real-profile-image {border-radius: 2rem;width: 14rem;height: 14rem;background-color: $fadedViolet;overflow: hidden;img {width: 100%;height: 100%;object-fit: cover;}}.profile-image {border-radius: 2rem;width: 14rem;height: 14rem;background-color: $fadedViolet;padding: 2.4rem;img {width: 100%;height: 100%;}}.executive-profile {display: flex;flex-direction: column;row-gap: 0.6rem;.name {color: $darkViolet;}.position {line-height: 1.4;color: $highlightViolet;}}}.right-side {display: flex;flex-direction: column;justify-content: flex-start;row-gap: 3rem;.title {color: $darkGrey;}.email,.phone,.secretary {display: flex;flex-direction: column;row-gap: 1.2rem;.label {display: flex;align-items: center;.icon {color: $darkGrey;font-size: 1.8rem;margin-left: 0.5rem;cursor: pointer;transition: 0.2s all ease-in-out;}.icon:hover {color: $highlightViolet;}}.content-text {color: $primaryViolet;}}}}.add-executive-card {width: 100%;height: 100%;border-radius: 2.5rem;background-color: $white;padding: 5.4rem 6.4rem;display: grid;grid-template-rows: 1fr 1.5fr;justify-items: center;align-items: center;.image-profile-upload {position: relative;.delete-button {cursor: pointer;top: 0%;right: 0%;transform: translateX(1rem) translateY(-1rem);position: absolute;background-color: $error;border-radius: 1rem;padding: 1rem 1.2rem;transition: 0.2s all ease-in-out;&:hover {background-color: $errorHover;}.icon {font-size: 1.4rem;color: $white;}}}.upload-profile {cursor: pointer;width: fit-content;height: fit-content;position: relative;input {display: none;}.upload-button {bottom: 0%;right: 0%;transform: translateX(1rem) translateY(1rem);position: absolute;background-color: $primaryViolet;border-radius: 1rem;padding: 1rem;.icon {font-size: 1.4rem;color: $white;}}.profile-image {border-radius: 2rem;width: 14rem;height: 14rem;background-color: $fadedViolet;padding: 2.4rem;img {width: 100%;height: 100%;}}.preview-img {border-radius: 2rem;width: 14rem;height: 14rem;overflow: hidden;img {width: 100%;height: 100%;object-fit: cover;}}}.information {width: 100%;height: 100%;display: flex;flex-direction: column;gap: 3rem;.input {display: flex;gap: 5rem;.input-form {.readonly { background-color: $grey !important }width: 100%;display: flex;flex-direction: column;select,input[type="text"],input[type="tel"] {margin-top: 1rem;padding: 1rem 1.4rem;width: 100%;height: 4rem;border-radius: 0.5rem;border: none;background-color: $primaryGrey;font-family: "Poppins", sans-serif;}input[type="text"]:focus,input[type="tel"]:focus {outline: none;border: 0.1rem solid $primaryViolet;}input::placeholder {font-size: 1.4rem;color: $darkGrey;}select {font-size: 1.4rem;}select:focus {outline: none;border: 0.1rem solid $primaryViolet;}}}.form-button {width: 100%;justify-content: flex-end;display: flex;gap: 1.5rem;}}}}}}
@media (max-width: 63.5em) {.executive-screen {.body {.first-body-section {column-gap: 2rem;.container {padding: 3.4rem 4.4rem;}.executive-card {grid-template-columns: 0.75fr 1.25fr;}}}}}
@media (max-width: 40em) {.executive-screen {.body {.first-body-section {.filter-executive {.list-executive-card {height: 72rem;}}.executive-card {display: flex;flex-direction: column;row-gap: 4rem;}}}}}
@media (max-width: 26.75em) {input,select {height: 4.8rem !important;}.search-mobile-button {display: block;}.mobile-button-actions {position: fixed;display: flex;flex-direction: column;row-gap: 2rem;}.mobile-button,.mobile-button-search {display: flex;}.laptop {display: none;}.executive-screen {.body {.first-body-section {grid-template-columns: 1fr;.add-executive-card {display: flex;flex-direction: column;row-gap: 6rem;.upload-profile {.profile-image,.preview-img {width: 16rem;height: 16rem;}}.information {.input {flex-direction: column;row-gap: 3rem;}.form-button {flex-direction: column-reverse;}}}.laptop {display: none;}.container {height: 100rem;padding: 7.2rem 5.2rem;}.executive-card {row-gap: 6rem;.right-side {row-gap: 4.8rem;}.left-side {.real-profile-image,.profile-image {width: 16rem;height: 16rem;}}}}}}}
</style>