import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const routes = [
  {
    path: "/sign-in",
    name: "sign-in",
    component: () => import("@/views/main/SignInView.vue"),
    beforeEnter: (to, from, next) => {
      const loggedIn = localStorage.getItem("user");
      if (!loggedIn) {
        next();
      } else {
        next("/");
      }
    },
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/main/HomeView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/calendar",
    name: "calendar",
    component: () => import("@/views/main/CalendarView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/executives-management",
    name: "executive",
    props: true,
    component: () => import("@/views/main/ExecutiveView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/meetings-inbox/:type/:id",
    name: "inbox-detail",
    component: () => import("@/views/main/meeting/mobile/InboxViewDetail.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/meetings-sent/:type/:id",
    name: "sent-detail",
    component: () => import("@/views/main/meeting/mobile/SentViewDetail.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/meetings-be-confirmed/:type/:id",
    name: "be-confirmed-detail",
    component: () =>
      import("@/views/main/meeting/mobile/BeConfirmedViewDetail.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/meetings-confirmed/:type/:id",
    name: "confirmed-detail",
    component: () =>
      import("@/views/main/meeting/mobile/ConfirmedViewDetail.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/meetings-replied/:type/:id",
    name: "replied-detail",
    component: () =>
      import("@/views/main/meeting/mobile/RepliedViewDetail.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/meetings-management",
    name: "meeting",
    props: true,
    component: () => import("@/views/main/MeetingView.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/setting",
    name: "setting",
    component: () => import("@/views/main/SettingView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/reauthentication",
    name: "ReAuthentication",
    component: () => import("@/views/exception/ReAuthenticateView.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    name: "NotFound",
    component: () => import("@/views/exception/NotFoundView.vue"),
  },
];

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next("/sign-in");
    }
  } else {
    next();
  }
});
export default router;
