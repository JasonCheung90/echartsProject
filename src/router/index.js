import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home
  // },
  {
    path: "/sellerpage",
    name: "SellerPage",
    component: () =>
      import(/* webpackChunkName: "SellerPage" */ "../views/SellerPage.vue")
  },

  { path: "*", redirect: "/sellerpage" }
];

const router = new VueRouter({
  routes
});

export default router;
