// import jwtDecrypt from "@/helpers/jwtHelper";
export default function authHeader() {
  // let user = jwtDecrypt(JSON.parse(localStorage.getItem("user")));
  let user = localStorage.getItem("user");

  if (user) {
    // for Node.js Express back-end
    return { Authorization: "Bearer " + user };
    // return { "x-access-token": user.token };
  } else {
    return {};
  }
}
