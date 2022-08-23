import AuthService from "@/services/auth.service";
import jwtDecrypt from "@/helpers/jwtHelper";
const user = localStorage.getItem("user") ? jwtDecrypt(localStorage.getItem("user")) : null;
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };
export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        (user) => {
          commit("loginSuccess", user);
          return Promise.resolve(user);
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },
  },
  mutations:{
    loginSuccess(state, user) {
        state.user = user;
    },
    loginFailure(state) {
        state.user = null;
    },
    logout(state) {
        state.user = null;
    }
  }
};