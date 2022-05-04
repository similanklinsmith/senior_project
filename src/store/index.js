import { createStore } from "vuex";
import axios from "axios";
const BASE_URL = process.env.VUE_APP_API_PATH;
export default createStore({
  state: {
    executiveURL: `${BASE_URL}/executives`,
    executives: [],
  },
  getters: {
    getExecutives(state) {
      return state.executives;
    },
  },
  mutations: {
    GET_EXECUTIVES(state, executives) {
      state.executives = executives;
    },
  },
  actions: {
    async getExecutives(context) {
      try {
        const data = await axios.get(this.state.executiveURL);
        console.log(data);
        context.commit("GET_EXECUTIVES", data.data);
      } catch (error) {
        // alert(error);
        console.log(error);
      }
    },
  },
  modules: {},
});
