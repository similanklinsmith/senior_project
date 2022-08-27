import { createStore } from "vuex";
import axios from "axios";
const BASE_URL = process.env.VUE_APP_API_PATH;
import { auth } from "./auth.module";
import authHeader from "@/services/auth-header";
import router from "@/router";
import { signOut } from "firebase/auth";
export default createStore({
  state: {
    // auth
    getAuth: null,
    //secretaries
    secretaryURL: `${BASE_URL}/secretary`,
    secretaryImageURL: "https://graph.microsoft.com/v1.0/me/photo/$value",
    myProfile: null,
    myProfilePic: null,
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
    myPollsURL: `${BASE_URL}/yourPolls`,
    myPolls: [],

    // beConfirmed lists
    myBeConfirmedURL: `${BASE_URL}/yourConfirmed`,
    myBeConfirmeds: [],

    loadingStatus: false,
    success: false,
    failed: false,
  },
  mutations: {
    GET_LOADING_STATUS(state, loadingStatus) {
      state.loadingStatus = loadingStatus;
    },
    GET_SUCCESS(state, success) {
      state.success = success;
    },
    GET_FAILED(state, failed) {
      state.failed = failed;
    },
    GET_PROFILE(state, profile) {
      state.myProfile = profile;
    },
    GET_PROFILE_PIC(state, pic) {
      state.myProfilePic = pic;
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
    DELETE_MY_POLL(state, id) {
      const index = state.myPolls.findIndex((poll) => poll.id == id);
      if (index !== -1) {
        state.myPolls.splice(index, 1);
      }
    },
    GET_MY_BE_CONFIRMED(state, beConfirmeds) {
      state.myBeConfirmeds = beConfirmeds;
    },
  },
  actions: {
    async getMyProfile(context) {
      try {
        const data = await axios.get(this.state.secretaryURL, {
          headers: authHeader(),
        });
        context.commit("GET_PROFILE", data.data.data);
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status == 401) {
          signOut(this.state.getAuth).then(() => {
            router.push("/sign-in");
          });
          this.dispatch("auth/logout");
        }
      }
    },
    async getProfileImage(context) {
      var accessToken = localStorage.getItem("accessToken");
      try {
        await axios
          .get(this.state.secretaryImageURL, {
            headers: {
              "content-type": "image/jpeg",
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: "blob",
          })
          .then((result) => {
            let blob = new Blob([result.data], { type: "image/jpeg" });
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => {
              var base64String = reader.result;
              context.commit(
                "GET_PROFILE_PIC",
                base64String
                  .toString()
                  .substr(base64String.toString().indexOf(", ") + 1)
              );
            };
          });
      } catch (error) {
        console.log(error);
        if (error.response.status == 401) {
          signOut(this.state.getAuth).then(() => {
            router.push("/sign-in");
          });
          this.dispatch("auth/logout");
        }
      }
    },
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
          data.data.data.sort((a, b) =>
            a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1
          )
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
          data.data.data.sort((a, b) =>
            a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1
          )
        );
        context.commit("GET_LOADING_STATUS", false);
      } catch (error) {
        context.commit("GET_LOADING_STATUS", false);
        console.log(error.response.status);
        if (error.response.status == 401) {
          signOut(this.state.getAuth).then(() => {
            router.push("/sign-in");
          });
          this.dispatch("auth/logout");
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
          if (error.response.status == 401) {
            context.commit("GET_FAILED", true);
            setTimeout(
              () => (
                context.commit("GET_FAILED", false),
                signOut(this.state.getAuth).then(() => {
                  router.push("/sign-in");
                }),
                this.dispatch("auth/logout")
              ),
              3000
            );
          }
          setTimeout(() => context.commit("GET_FAILED", false), 3000);
        }
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status == 401) {
          context.commit("GET_FAILED", true);
          setTimeout(
            () => (
              context.commit("GET_FAILED", false),
              signOut(this.state.getAuth).then(() => {
                router.push("/sign-in");
              }),
              this.dispatch("auth/logout")
            ),
            2500
          );
        }
        setTimeout(() => context.commit("GET_FAILED", false), 2500);
      }
    },
    async editExecutive(context, payload) {
      context.commit("GET_LOADING_STATUS", true);
      let imageResponse = payload.img_profile;
      try {
        if (typeof payload.img_profile != "string") {
          const formData = new FormData();
          formData.append("files", payload.img_profile);
          let result = await axios.post(this.state.imageURL, formData);
          imageResponse = result.data.image_name;
        }
        try {
          const editExecutive = payload.editExecutive;
          editExecutive["img_profile"] = imageResponse;
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
          if (error.response.status == 401) {
            signOut(this.state.getAuth).then(() => {
              router.replace("/sign-in");
            }),
              this.dispatch("auth/logout");
          }
        }
      } catch (error) {
        console.log(error.response.status);
        context.commit("GET_FAILED", true);
        if (error.response.status == 401) {
          context.commit("GET_FAILED", true);
          setTimeout(
            () => (
              context.commit("GET_FAILED", false),
              signOut(this.state.getAuth).then(() => {
                router.replace("/sign-in");
              }),
              this.dispatch("auth/logout")
            ),
            2500
          );
        }
        setTimeout(
          () => (
            context.commit("GET_FAILED", false),
            context.commit("GET_LOADING_STATUS", false)
          ),
          2500
        );
      }
    },
    async deleteExecutive(context, id) {
      try {
        await axios.delete(this.state.myExecutiveURL + "/" + id, {
          headers: authHeader(),
        });
        context.commit("DELETE_MY_EXECUTIVE", id);
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status == 401) {
          context.commit("GET_FAILED", true);
          setTimeout(
            () => (
              context.commit("GET_FAILED", false),
              signOut(this.state.getAuth).then(() => {
                router.replace("/sign-in");
              }),
              this.dispatch("auth/logout")
            ),
            2500
          );
        }
        setTimeout(() => context.commit("GET_FAILED", false), 2500);
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
        if (error.response.status == 401) {
          signOut(this.state.getAuth).then(() => {
            router.replace("/sign-in");
          });
          this.dispatch("auth/logout");
        }
      }
    },
    async addPollAppointment(context, payload) {
      try {
        const newPoll = payload;
        const response = await axios.post(this.state.addPollURL, newPoll, {
          headers: authHeader(),
        });
        context.commit("ADD_POLLS", response.data.data);
        context.commit("GET_SUCCESS", true);
        setTimeout(() => context.commit("GET_SUCCESS", false), 3000);
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status == 401) {
          context.commit("GET_FAILED", true);
          setTimeout(
            () => (
              context.commit("GET_FAILED", false),
              signOut(this.state.getAuth).then(() => {
                router.replace("/sign-in");
              }),
              this.dispatch("auth/logout")
            ),
            2500
          );
        }
        setTimeout(() => context.commit("GET_FAILED", false), 2500);
      }
    },
    async deletePollAppointment(context, id) {
      try {
        const response = await axios.delete(this.state.addPollURL + "/" + id, {
          headers: authHeader(),
        });
        console.log(response.status);
        if (response.status == 400) {
          console.log("need to login");
        }
        context.commit("DELETE_MY_POLL", id);
      } catch (error) {
        console.log(error.response);
        if (error.response.status == 401) {
          signOut(this.state.getAuth).then(() => {
            router.replace("/sign-in");
          });
          this.dispatch("auth/logout");
        }
      }
    },
    async getMyBeConfirmeds(context) {
      context.commit("GET_LOADING_STATUS", true);
      try {
        const data = await axios.get(this.state.myBeConfirmedURL, {
          headers: authHeader(),
        });
        context.commit(
          "GET_MY_BE_CONFIRMED",
          data.data.data.sort((a, b) => {
            return new Date(b.create_at) - new Date(a.create_at);
          })
        );
        context.commit("GET_LOADING_STATUS", false);
      } catch (error) {
        context.commit("GET_LOADING_STATUS", false);
        console.log(error.response.status);
        if (error.response.status == 401) {
          signOut(this.state.getAuth).then(() => {
            router.replace("/sign-in");
          });
          this.dispatch("auth/logout");
        }
      }
    },
  },
  getters: {
    getterLoadingStatus(state) {
      return state.loadingStatus;
    },
    getterSuccess(state) {
      return state.success;
    },
    getterFailed(state) {
      return state.failed;
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
    getterMyBeConfirmeds(state) {
      return state.myBeConfirmeds;
    },
  },
  modules: { auth },
});
