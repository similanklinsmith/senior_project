import { createStore } from "vuex";
import axios from "axios";
const BASE_URL = process.env.VUE_APP_API_PATH;
export default createStore({
  state: {
    executiveURL: `${BASE_URL}/executives`,
    executives: [],
    loadingStatus: false
  },
  mutations: {
    GET_LOADING_STATUS(state, loadingStatus) {
      state.loadingStatus = loadingStatus;
    },
    GET_EXECUTIVES(state, executives) {
      state.executives = executives;
    },
  },
  actions: {
    async getExecutives(context) {
      context.commit("GET_LOADING_STATUS",true);
      try {
        const data = await axios.get(this.state.executiveURL);
        context.commit("GET_EXECUTIVES", data.data.data.sort((a, b) => (a.first_name > b.first_name ? 1 : -1)));
        console.log(data.data);
        context.commit("GET_LOADING_STATUS",false);
      } catch (error) {
        // alert(error);
        context.commit("GET_LOADING_STATUS",false);
        console.log(error);
      }
    },
  },
  getters: {
    getterLoadingStatus(state) {
      return state.loadingStatus;
    },
    getterExecutives(state) {
      return state.executives;
    },
  },
  modules: {},
});
