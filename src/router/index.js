import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/sign-in",
    name: "sign-in",
    component: () => import("@/views/main/SignInView.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/main/HomeView.vue"),
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
    component: () => import("@/views/main/CalendarView.vue"),
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
    component: () => import("@/views/main/ExecutiveView.vue"),
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
    component: () => import("@/views/main/MeetingView.vue"),
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
    component: () => import("@/views/main/SettingView.vue"),
  },
  {
    path: "/:catchall(.*)",
    name: "NotFound",
    component: () => import("@/views/exception/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
