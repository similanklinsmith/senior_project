import { createStore } from "vuex";
import axios from "axios";
const BASE_URL = process.env.VUE_APP_API_PATH;
import { auth } from "./auth.module";
import authHeader from "../services/auth-header";
import router from "../router";
export default createStore({
  state: {
    // executives
    imageURL: `${BASE_URL}/image`,
    executiveTitleURL: `${BASE_URL}/executive-title-fulltitle`,
    executivePositionURL: `${BASE_URL}/executive-role-fullname`,
    executiveURL: `${BASE_URL}/executives`,
    myExecutiveURL: `${BASE_URL}/executive`,
    executiveTitle: [],
    executivePosition: [],
    executives: [],
    myExecutives: [],

    // appointment polls
    addPollURL: `${BASE_URL}/poll`,
    myPollsURL: `${BASE_URL}/polls`,
    myPolls: [],

    loadingStatus: false,
    responseStatus: false,
  },
  mutations: {
    GET_LOADING_STATUS(state, loadingStatus) {
      state.loadingStatus = loadingStatus;
    },
    GET_RESPONSE_STATUS(state, responseStatus) {
      state.responseStatus = responseStatus;
    },
    GET_EXECUTIVES_TITLES(state, titles) {
      state.executiveTitle = titles;
    },
    GET_EXECUTIVES_POSITIONS(state, positions) {
      state.executivePosition = positions;
    },
    GET_EXECUTIVES(state, executives) {
      state.executives = executives;
    },
    GET_MY_EXECUTIVES(state, executives) {
      state.myExecutives = executives;
    },
    ADD_EXECUTIVES(state, executives) {
      state.myExecutives.push(executives);
    },
    UPDATE_MY_EXECUTIVE(state, updateExecutive) {
      const index = state.myExecutives.findIndex(
        (executive) => executive.id === updateExecutive.id
      );
      if (index !== -1) {
        state.myExecutives.splice(index, 1, updateExecutive);
      }
    },
    DELETE_MY_EXECUTIVE(state, id) {
      const index = state.myExecutives.findIndex(
        (executive) => executive.id == id
      );
      if (index !== -1) {
        state.myExecutives.splice(index, 1);
      }
    },

    GET_MY_POLLS(state, polls) {
      state.myPolls = polls;
    },
    ADD_POLLS(state, polls) {
      state.myPolls.push(polls);
    },
  },
  actions: {
    async getExecutiveTitle(context) {
      try {
        const data = await axios.get(this.state.executiveTitleURL);
        context.commit("GET_EXECUTIVES_TITLES", data.data.data);
      } catch (error) {
        console.log(error);
      }
    },
    async getExecutivePosition(context) {
      try {
        const data = await axios.get(this.state.executivePositionURL);
        context.commit("GET_EXECUTIVES_POSITIONS", data.data.data);
      } catch (error) {
        console.log(error);
      }
    },
    async getExecutives(context) {
      context.commit("GET_LOADING_STATUS", true);
      try {
        const data = await axios.get(this.state.executiveURL);
        context.commit(
          "GET_EXECUTIVES",
          data.data.data.sort((a, b) => (a.first_name > b.first_name ? 1 : -1))
        );
        context.commit("GET_LOADING_STATUS", false);
      } catch (error) {
        context.commit("GET_LOADING_STATUS", false);
        console.log(error);
      }
    },
    async getMyExecutives(context) {
      // GET Executives by Secretary ID
      context.commit("GET_LOADING_STATUS", true);
      try {
        const data = await axios.get(this.state.myExecutiveURL + "/", {
          headers: authHeader(),
        });
        context.commit(
          "GET_MY_EXECUTIVES",
          data.data.data.sort((a, b) => (a.first_name > b.first_name ? 1 : -1))
        );
        context.commit("GET_LOADING_STATUS", false);
      } catch (error) {
        context.commit("GET_LOADING_STATUS", false);
        console.log(error.response.status);
        if (error.response.status == 400 || error.response.status == 403) {
          router.replace("/sign-in");
        }
      }
    },
    async addExecutive(context, payload) {
      try {
        const formData = new FormData();
        formData.append("files", payload.img_profile);
        const imageResponse =
          payload.img_profile == null
            ? null
            : await axios.post(this.state.imageURL, formData);
        try {
          const newExecutive = payload.newExecutive;
          newExecutive["img_profile"] =
            imageResponse == null ? null : imageResponse.data.image_name;
          const response = await axios.post(
            this.state.myExecutiveURL,
            newExecutive,
            {
              headers: authHeader(),
            }
          );
          context.commit("ADD_EXECUTIVES", response.data.data);
        } catch (error) {
          console.log(error.response.status);
          if (error.response.status == 403 || error.response.status == 400) {
            router.replace("/sign-in");
          }
        }
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status == 403 || error.response.status == 400) {
          router.replace("/sign-in");
        }
      }
    },
    async editExecutive(context, payload) {
      context.commit("GET_LOADING_STATUS", true);
      try {
        const formData = new FormData();
        formData.append("files", payload.img_profile);
        const imageResponse =
          payload.img_profile == null
            ? null
            : await axios.post(this.state.imageURL, formData);
        try {
          const editExecutive = payload.editExecutive;
          editExecutive["img_profile"] =
            imageResponse == null ? null : imageResponse.data.image_name;
          const response = await axios.put(
            this.state.myExecutiveURL + "/" + payload.id,
            editExecutive,
            {
              headers: authHeader(),
            }
          );
          console.log(response.status);
          if (response.status == 400) {
            console.log("need to login");
          }
          context.commit("UPDATE_MY_EXECUTIVE", response.data.data);
          context.commit("GET_LOADING_STATUS", false);
        } catch (error) {
          context.commit("GET_LOADING_STATUS", false);
          console.log(error.response.status);
          if (error.response.status == 403 || error.response.status == 400) {
            router.replace("/sign-in");
          }
        }
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status == 403 || error.response.status == 400) {
          router.replace("/sign-in");
        }
      }
    },
    async deleteExecutive(context, id) {
      try {
        const response = await axios.delete(
          this.state.myExecutiveURL + "/" + id,
          {
            headers: authHeader(),
          }
        );
        console.log(response.status);
        if (response.status == 400) {
          console.log("need to login");
        }
        context.commit("DELETE_MY_EXECUTIVE", id);
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status == 403 || error.response.status == 400) {
          router.replace("/sign-in");
        }
      }
    },

    async getMyPolls(context) {
      context.commit("GET_LOADING_STATUS", true);
      try {
        const data = await axios.get(this.state.myPollsURL, {
          headers: authHeader(),
        });
        context.commit(
          "GET_MY_POLLS",
          data.data.data.sort((a, b) => {
            return new Date(b.create_at) - new Date(a.create_at);
          })
        );
        context.commit("GET_LOADING_STATUS", false);
      } catch (error) {
        context.commit("GET_LOADING_STATUS", false);
        console.log(error.response.status);
        if (error.response.status == 400 || error.response.status == 403) {
          router.replace("/sign-in");
        }
      }
    },
    async addPollAppointment(context, payload) {
      console.log(payload);
      try {
        const newPoll = payload;
        const response = await axios.post(this.state.addPollURL, newPoll, {
          headers: authHeader(),
        });
        context.commit("ADD_POLLS", response.data.data);
        context.commit("GET_RESPONSE_STATUS", true);
        setTimeout(() => context.commit("GET_RESPONSE_STATUS", false), 3000);
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status == 403 || error.response.status == 400) {
          router.replace("/sign-in");
        }
        context.commit("GET_RESPONSE_STATUS", false);
      }
    },
  },
  getters: {
    getterLoadingStatus(state) {
      return state.loadingStatus;
    },
    getterResponseStatus(state) {
      return state.responseStatus;
    },
    getterExecutiveTitles(state) {
      return state.executiveTitle;
    },
    getterExecutivePositions(state) {
      return state.executivePosition;
    },
    getterExecutives(state) {
      return state.executives;
    },
    getterMyExecutives(state) {
      return state.myExecutives;
    },

    getterMyPolls(state) {
      return state.myPolls;
    },
  },
  modules: { auth },
});
