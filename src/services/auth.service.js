// Authentication service
import axios from "axios";
const API_URL = process.env.VUE_APP_API_PATH;

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "/login", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    return axios.post(API_URL + "register" , {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      password: user.password,
      role_id: 3,
    });
  }
}

export default new AuthService();