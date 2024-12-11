import { createRouter, createWebHistory } from "vue-router";
import CategoriesPage from "./components/CategoriesPage.vue";
import BrandsPage from "./components/BrandsPage.vue";
import SubcategoriesPage from "./components/SubcategoriesPage.vue";

const routes = [
  { path: "/categories/:categoryId", name: "CategoriesPage", component: CategoriesPage },
  { path: "/subcategories/:subcategoryId", name: "SubcategoriesPage", component: SubcategoriesPage },
  { path: "/brands/:brandName", name: "BrandsPage", component: BrandsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
