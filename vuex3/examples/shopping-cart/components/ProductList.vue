<template>
  <ul>
    <li v-for="product in products" :key="product.id">
      {{ product.title }} - {{ product.price | currency }}
      <br />
      <button :disabled="!product.inventory" @click="addProductToCart(product)">
        Add to cart
      </button>
    </li>

    <li>
      ccc{{ ccc }}
      <button @click="add">add</button>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: mapState({
    products: (state) => state.products.all,
    ccc: (state) => state.custom.ccc,
  }),
  methods: {
    ...mapActions("cart", ["addProductToCart"]),
    add() {
      // this.$store.commit("add");
      this.$store.commit("custom/add");
    },
  },
  created() {
    this.$store.dispatch("products/getAllProducts");
    console.log(this.$store);
    // console.log(this.);
  },
};
</script>
