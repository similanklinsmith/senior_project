import { createStore } from "vuex";
import axios from "axios";
const BASE_URL = process.env.VUE_APP_API_PATH;
import { auth } from "./auth.module";
import authHeader from "../services/auth-header";
export default createStore({
  state: {
    executiveTitle: [],
    executivePosition: [],
    executiveTitleURL: `${BASE_URL}/executive-title`,
    executivePositionURL: `${BASE_URL}/executive-role`,
    executiveURL: `${BASE_URL}/executives`,
    myExecutiveURL: `${BASE_URL}/executive`,
    executives: [],
    myExecutives: [],
    loadingStatus: false,
  },
  mutations: {
    GET_LOADING_STATUS(state, loadingStatus) {
      state.loadingStatus = loadingStatus;
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
  },
  actions: {
    async getExecutiveTitle(context) {
      try {
        const data = await axios.get(this.state.executiveTitleURL);
        context.commit("GET_EXECUTIVES_TITLES", data.data.data);
        console.log(data.status);
      } catch (error) {
        console.log(error);
      }
    },
    async getExecutivePostion(context) {
      try {
        const data = await axios.get(this.state.executivePositionURL);
        context.commit("GET_EXECUTIVES_POSITIONS", data.data.data);
        console.log(data.status);
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
        console.log(data.status);
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
        console.log(data.status);
        context.commit("GET_LOADING_STATUS", false);
      } catch (error) {
        context.commit("GET_LOADING_STATUS", false);
        console.log(error);
      }
    },
    async addExecutive(context, payload) {
      // const jsonExecutive = JSON.stringify(payload.newExecutive);
      // const blob = new Blob([jsonExecutive], {
      //   type: "application/json",
      // });
      // const formData = new FormData();
      // formData.append("newExecutive", blob);
      try {
        const response = await axios.post(
          this.state.myExecutiveURL,
          payload.newExecutive,
          {
            headers: authHeader(),
          },
        );
        console.log(response.status);
        if (response.status == 400) {
          console.log("need to login");
        }
        context.commit("ADD_EXECUTIVES", response.data.data);
      } catch (error) {
        console.log(error);
      }
    },
    async editExecutive(context, payload) {
      context.commit("GET_LOADING_STATUS", true);
      try {
        const response = await axios.put(
          this.state.myExecutiveURL+"/"+payload.id,
          payload.editExecutive,
          {
            headers: authHeader(),
          },
        );
        console.log(response.status);
        if (response.status == 400) {
          console.log("need to login");
        }
        context.commit("UPDATE_MY_EXECUTIVE", response.data.data);
        context.commit("GET_LOADING_STATUS", false);
      } catch (error) {
        context.commit("GET_LOADING_STATUS", false);
        console.log(error);
      }
    },
    async deleteExecutive(context, id) {
      try {
        const response = await axios.delete(
          this.state.myExecutiveURL + "/" + id,
          {
            headers: authHeader(),
          },
        );
        console.log(response.status);
        if (response.status == 400) {
          console.log("need to login");
        }
        context.commit("DELETE_MY_EXECUTIVE", id);
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    getterLoadingStatus(state) {
      return state.loadingStatus;
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
  },
  modules: { auth },
});
