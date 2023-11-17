import { createRouter, createWebHistory } from "vue-router";

//Structure
import Structure from "../views/Structure/Structure.vue";

//Pages
import Login from "../views/modules/Login/Login.vue";
import Home from "../views/modules/Home/Home.vue";

//Middlewares
import { keepConnected } from "@/middlewares/keepConnected";

export const routes = [
  {
    path: "/main",
    name: "Structure",
    component: Structure,
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
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: keepConnected,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
