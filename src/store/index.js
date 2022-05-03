import { createStore } from "vuex";
import axios from "axios";
const BASE_URL = "http://localhost:9000";
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
    SET_EXECUTIVES(state, executives) {
      state.executives = executives;
    },
  },
  actions: {
    async getExecutives(context) {
      try {
        const data = await axios.get(this.state.executiveURL);
        context.commit("SET_EXECUTIVES", data.data);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
  modules: {},
});
