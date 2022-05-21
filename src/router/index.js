import { createRouter, createWebHistory } from "vue-router";
const SignIn = () => import("../views/main/SignInView.vue");
const Home = () => import("../views/main/HomeView.vue");
const Calendar = () => import("../views/main/CalendarView.vue");
const Executive = () => import("../views/main/ExecutiveView.vue");
const Meeting = () => import("../views/main/MeetingView.vue");
const Setting = () => import("../views/main/SettingView.vue");
const NotFound = () => import("../views/exception/NotFoundView.vue");

const routes = [
  {
    path: "/sign-in",
    name: "sign-in",
    component: SignIn,
  },
  {
    path: "/",
    name: "home",
    component: Home,
    beforeEnter: (to, from, next) => {
      const loggedIn = localStorage.getItem("user");
      if (loggedIn) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/calendar",
    name: "calendar",
    component: Calendar,
    beforeEnter: (to, from, next) => {
      const loggedIn = localStorage.getItem("user");
      if (loggedIn) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/executives-management",
    name: "executive",
    props: true,
    component: Executive,
    beforeEnter: (to, from, next) => {
      const loggedIn = localStorage.getItem("user");
      if (loggedIn) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/meetings-management",
    name: "meeting",
    component: Meeting,
    beforeEnter: (to, from, next) => {
      const loggedIn = localStorage.getItem("user");
      if (loggedIn) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/setting",
    name: "setting",
    component: Setting,
  },
  {
    path: "/:catchall(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
