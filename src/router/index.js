import { createRouter, createWebHistory } from "vue-router";
const SignIn = () => import("../views/main/SignInView.vue");
const Home = () => import("../views/main/HomeView.vue");
const Executive = () => import("../views/main/ExecutiveView.vue");
const Meeting = () => import("../views/main/MeetingView.vue");
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
  },
  {
    path: "/executives-management",
    name: "executive",
    props: true,
    component: Executive,
  },
  {
    path: "/meetings-management",
    name: "meeting",
    component: Meeting,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
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
