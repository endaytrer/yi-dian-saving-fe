<template>
  <el-main class="home">
    <Abstract ref="abstract" moneySign="¥" @needRefresh="loadProcess" />
    <h5 v-if="!isLoadingProcess">存款进度</h5>
    <el-progress
      v-loading="isLoadingProcess"
      class="progress"
      :color="[
        {
          color: '#f56c6c',
          percentage: 20,
        },
        {
          color: '#e6a237',
          percentage: 40,
        },
        {
          color: '#5cb87a',
          percentage: 60,
        },
        {
          color: '#1989fa',
          percentage: 80,
        },
        {
          color: '#6f7ad3',
          percentage: 100,
        },
      ]"
      :stroke-width="10"
      type="circle"
      :width="150"
      :percentage="displayPercentage"
    ></el-progress>
    <ul
      class="infinite-list"
      v-if="isLoadingOwned || investedCount"
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
          :interestRate="product.product.interestRate"
          :total="product.product.total"
          :owned="product.amount"
          :remains="product.product.remains"
          :category="product.product.category"
          :minimumHoldTime="product.product.minimumHoldTime"
          :expires="product.expires"
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
          :interestRate="product.interestRate"
          :minimumHoldTime="product.minimumHoldTime"
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
import Abstract from "@/components/Abstract.vue";
import Product from "@/components/Product.vue";
import {
  getAllProducts,
  getInvestedProducts,
  getUserInfo,
  testLogin,
} from "@/utils/Requests";
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {
    Abstract,
    Product,
    OwnedProduct,
  },
})
export default class Home extends Vue {
  public isLoadingProcess = true;
  public isLoadingOwned = true;
  public isLoadingProduct = true;
  public products: { category: number }[] = [];
  public ownedProducts = [];
  public productCount = 0;
  public investedCount = 0;
  public target = 0;
  public balance = 0;
  get r1Products() {
    return this.products.filter((product) => product.category === 0);
  }
  get r2Products() {
    return this.products.filter((product) => product.category > 0);
  }
  public get displayPercentage() {
    if (this.target === 0 && this.balance === 0) {
      return 0;
    }
    if (this.target === 0) {
      return 100;
    }
    if (this.balance / this.target > 1) {
      return 100;
    }
    return Number.parseFloat(((this.balance / this.target) * 100).toFixed(2));
  }
  async mounted() {
    if (!(await testLogin())) {
      this.$router.push("/");
    }
    this.loadProcess();
    this.loadProducts();
    this.loadOwned();
  }
  async loadProcess() {
    this.isLoadingProcess = true;
    const userInfo = await getUserInfo();
    this.balance = Number.parseFloat(userInfo.balance);
    this.target = Number.parseFloat(userInfo.target);
    this.isLoadingProcess = false;
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
    this.loadProcess();
    this.loadProducts();
    this.loadOwned();
    const element = this.$refs["abstract"] as Abstract;
    element.updateUserInfo();
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