<template>
  <el-col class="welcome">
    <el-main class="title-container">
      <el-col :offset="4">
        <h1>亿点存钱</h1>
        <h2>年轻人的存钱平台</h2>
      </el-col>
    </el-main>
    <el-col class="button-container">
      <router-link to="/login"
        ><el-button
          round
          width="100%"
          class="screenwide-button transparent-button"
          >登录</el-button
        ></router-link
      >
      <router-link to="/register">
        <el-button round type="primary" class="screenwide-button"
          >注册</el-button
        >
      </router-link>
    </el-col>
  </el-col>
</template>

<script lang="ts">
import { testLogin } from "@/utils/Requests";
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class Welcome extends Vue {
  async mounted() {
    if (await testLogin()) {
      this.$router.push("/home");
    }
  }
}
</script>

<style scoped>
.welcome {
  width: 100%;
  min-height: 100%;
  background-image: linear-gradient(35deg, #00b44e, #3cb165);
}
.title-container {
  height: calc(100vh - 120px);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  text-align: left;
  flex-direction: column;
  justify-content: center;
}
.title-container h1 {
  font-size: 25px;
  line-height: 10px;
  color: var(--contrast-foreground);
}
.title-container h2 {
  font-weight: normal;
  font-size: 18px;
  line-height: 10px;
  color: var(--contrast-foreground);
}
.button-container {
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.transparent-button {
  background-color: transparent !important;
  color: var(--contrast-foreground);
}
.screenwide-button {
  margin: 0 !important;
  width: calc(100vw - 20px);
}
</style>