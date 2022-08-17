import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getAuth } from "firebase/auth";
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
    // meta: {
    //   authRequired: true,
    // },
    meta: {
      requiresAuth: true,
    },
    // beforeEnter: (to, from, next) => {
    //   const loggedIn = localStorage.getItem("user");
    //   if (loggedIn) {
    //     next();
    //   } else {
    //     next("/sign-in");
    //   }
    // },
  },
  {
    path: "/calendar",
    name: "calendar",
    component: () => import("@/views/main/CalendarView.vue"),
    meta: {
      requiresAuth: true,
    },
    // beforeEnter: (to, from, next) => {
    //   const loggedIn = localStorage.getItem("user");
    //   if (loggedIn) {
    //     next();
    //   } else {
    //     next("/sign-in");
    //   }
    // },
  },
  {
    path: "/executives-management",
    name: "executive",
    props: true,
    component: () => import("@/views/main/ExecutiveView.vue"),
    meta: {
      requiresAuth: true,
    },
    // beforeEnter: (to, from, next) => {
    //   const loggedIn = localStorage.getItem("user");
    //   if (loggedIn) {
    //     next();
    //   } else {
    //     next("/sign-in");
    //   }
    // },
  },
  {
    path: "/meetings-inbox/:type/:id",
    name: "inbox-detail",
    component: () => import("@/views/main/meeting/mobile/InboxViewDetail.vue"),
    meta: {
      requiresAuth: true,
    },
    // beforeEnter: (to, from, next) => {
    //   const loggedIn = localStorage.getItem("user");
    //   if (loggedIn) {
    //     next();
    //   } else {
    //     next("/sign-in");
    //   }
    // },
  },
  {
    path: "/meetings-sent/:type/:id",
    name: "sent-detail",
    component: () => import("@/views/main/meeting/mobile/SentViewDetail.vue"),
    meta: {
      requiresAuth: true,
    },
    // beforeEnter: (to, from, next) => {
    //   const loggedIn = localStorage.getItem("user");
    //   if (loggedIn) {
    //     next();
    //   } else {
    //     next("/sign-in");
    //   }
    // },
  },
  {
    path: "/meetings-be-confirmed/:type/:id",
    name: "be-confirmed-detail",
    component: () =>
      import("@/views/main/meeting/mobile/BeConfirmedViewDetail.vue"),
      meta: {
        requiresAuth: true,
      },
    // beforeEnter: (to, from, next) => {
    //   const loggedIn = localStorage.getItem("user");
    //   if (loggedIn) {
    //     next();
    //   } else {
    //     next("/sign-in");
    //   }
    // },
  },
  {
    path: "/meetings-management",
    name: "meeting",
    props: true,
    component: () => import("@/views/main/MeetingView.vue"),
    meta: {
      requiresAuth: true,
    },
    // beforeEnter: (to, from, next) => {
    //   const loggedIn = localStorage.getItem("user");
    //   if (loggedIn) {
    //     next();
    //   } else {
    //     next("/sign-in");
    //   }
    // },
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
// router.beforeEach((to, from, next) => {
//   if (to.path === '/sign-in' && getAuth().currentUser) {
//     next('/')
//     alert(getAuth().currentUser);
//     return;
//   }

//   if (to.matched.some(record => record.meta.requiresAuth) && !getAuth().currentUser) {
//     alert(getAuth().currentUser);
//     next('/sign-in')
//     return;
//   }
//   alert(getAuth().currentUser && getAuth().currentUser.displayName);
//   alert("out");
//   next();
// // })
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.authRequired)) {
//     if (getAuth().currentUser) {
//       next();
//     } else {
//       alert('You must be logged in to see this page');
//       next({
//         path: '/sign-in',
//       });
//     }
//   } else {
//     next();
//   }
// });
export default router;
