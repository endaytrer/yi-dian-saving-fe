<template>
  <el-main class="home">
    <ul
      class="infinite-list"
      v-if="isLoadingProduct || investedCount"
      v-loading="isLoadingOwned"
    >
      <h5>已购产品</h5>
      <li
        v-for="product in ownedProducts"
        class="infinite-list-item"
        :key="product.id"
      >
        <OwnedProduct
          :recordId="product.id"
          :name="product.product.productName"
          :price="product.product.price"
          :initialPrice="product.initialPrice"
          :percentage="
            ((product.product.price - product.product.lastPrice) /
              product.product.lastPrice) *
            100
          "
          :producer="product.product.providerName"
          :total="product.product.total"
          :owned="product.amount"
          :remains="product.product.remains"
          :category="product.product.category"
          :minimumHoldTime="product.product.minimumHoldTime"
          :expires="product.expires"
          :interestRate="product.product.interestRate"
          moneySign="¥"
          @needRefresh="refreshAll"
        />
      </li>
    </ul>
    <ul
      class="infinite-list"
      v-if="isLoadingProduct || productCount"
      v-loading="isLoadingProduct"
    >
      <h5>全部产品(R1)</h5>
      <li
        v-for="product in r1Products"
        class="infinite-list-item"
        :key="product.id"
      >
        <Product
          :productId="product.id"
          :name="product.productName"
          :price="product.price"
          :percentage="
            ((product.price - product.lastPrice) / product.lastPrice) * 100
          "
          :producer="product.providerName"
          :total="product.total"
          :remains="product.remains"
          :category="product.category"
          :minimumHoldTime="product.minimumHoldTime"
          :interestRate="product.interestRate"
          moneySign="¥"
          @needRefresh="refreshAll"
        />
      </li>
      <h5>全部产品(R2)</h5>
      <li
        v-for="product in r2Products"
        class="infinite-list-item"
        :key="product.id"
      >
        <Product
          :productId="product.id"
          :name="product.productName"
          :price="product.price"
          :percentage="
            ((product.price - product.lastPrice) / product.lastPrice) * 100
          "
          :producer="product.providerName"
          :total="product.total"
          :remains="product.remains"
          :category="product.category"
          :minimumHoldTime="product.minimumHoldTime"
          :interestRate="product.interestRate"
          moneySign="¥"
          @needRefresh="refreshAll"
        />
      </li>
    </ul>
  </el-main>
</template>

<script lang="ts">
import OwnedProduct from "@/components/OwnedProduct.vue";
import Product from "@/components/Product.vue";
import {
  getAllProducts,
  getInvestedProducts,
  testLogin,
} from "@/utils/Requests";
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {
    Product,
    OwnedProduct,
  },
})
export default class Finance extends Vue {
  public isLoadingOwned = true;
  public isLoadingProduct = true;
  public products: { category: number }[] = [];
  public ownedProducts = [];
  public productCount = 0;
  public investedCount = 0;

  get r1Products() {
    return this.products.filter((product) => product.category === 0);
  }
  get r2Products() {
    return this.products.filter((product) => product.category > 0);
  }

  async created() {
    if (!(await testLogin())) {
      this.$router.push("/");
    }
    this.loadProducts();
    this.loadOwned();
  }
  async loadProducts() {
    this.isLoadingProduct = true;
    const allProducts = await getAllProducts();
    this.productCount = allProducts.total;
    this.products = allProducts.products;
    this.isLoadingProduct = false;
  }
  async loadOwned() {
    this.isLoadingOwned = true;
    const ownedProducts = await getInvestedProducts();
    this.investedCount = ownedProducts.total;
    this.ownedProducts = ownedProducts.products;
    this.isLoadingOwned = false;
  }
  refreshAll() {
    this.loadProducts();
    this.loadOwned();
  }
}
</script>
<style scoped>
.home {
  width: 100%;
  min-height: 100%;
  background-color: var(--main-background);
}
.home h5 {
  color: var(--tertiary-foreground);
  margin: 20px 0;
  text-align: left;
}
.home .infinite-list {
  list-style-type: none;
  padding: 0;
  overflow: visible;
}
</style>