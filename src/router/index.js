import { createRouter, createWebHistory } from "vue-router";

//Templates
import MainTemplate from "@/components/templates/MainTemplate.vue";

//Pages
import Login from "@/pages/Login.vue";
import Home from "@/pages/Home.vue";

//Middlewares
import { keepConnected } from "@/middlewares/keepConnected";

export const routes = [
  {
    path: "/main",
    name: "MainTemplate",
    component: MainTemplate,
    children: [
      {
        path: "/main/home",
        name: "Home",
        menuLabel: "Home",
        component: Home,
      },
    ],
  },
  {
    path: "/",
    name: "Login",
    component: Login,
    beforeEnter: keepConnected,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
