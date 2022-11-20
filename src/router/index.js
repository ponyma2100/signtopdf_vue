import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Sign from "../views/Sign.vue";
import Edit from "../views/Edit.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/sign",
      name: "sign",
      component: Sign,
    },
    {
      path: "/edit",
      name: "edit",
      component: Edit,
    },
  ],
});

export default router;
