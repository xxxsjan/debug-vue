import Vue from "vue";
import Vuex from "vuex";
import cart from "./modules/cart";
import products from "./modules/products";
import createLogger from "../../../src/plugins/logger";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    cart,
    products,
    custom: {
      namespaced: true,
      modules: {
        custom2: {
          state: { ccc: 222 },
        },
      },
      state: { ccc: 111 },
      mutations: {
        add(state, payload) {
          state.ccc++;
        },
      },
    },
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
