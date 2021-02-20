<template>
  <transition name="el-fade-in">
    <el-col class="login">
      <el-main class="main">
        <el-col class="title-container">
          <h1>亿点存钱</h1>
          <h2>年轻人的存钱平台</h2>
        </el-col>
        <el-col class="input-container">
          <el-form :model="user" :rules="rules" ref="loginForm"
            ><el-form-item label="身份" prop="identity"
              ><el-input
                v-model="user.identity"
                placeholder="用户名/邮箱"
                clearable
            /></el-form-item>
            <el-form-item label="密码" prop="password"
              ><el-input
                v-model="user.password"
                placeholder="密码"
                show-password
                clearable /></el-form-item
          ></el-form>
        </el-col>
        <el-col class="button-container">
          <el-button type="text" @click="cancelLogin">取消</el-button>
          <el-button
            round
            width="100%"
            type="primary"
            class="screenwide-button"
            @click="login"
            >登录</el-button
          >
        </el-col>
      </el-main>
    </el-col>
  </transition>
</template>

<script lang="ts">
import { login, logout, testLogin } from "@/utils/Requests";
import { Component, Vue, Watch } from "vue-property-decorator";
@Component({})
export default class Login extends Vue {
  public user = {
    identity: "",
    password: "",
  };
  public rules = {
    identity: [
      {
        required: true,
        message: "请输入用户名",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "请输入密码",
        trigger: "blur",
      },
      {
        min: 6,
        message: "密码长度在6个字符及以上",
        trigger: "blur",
      },
    ],
  };
  async mounted() {
    if (await testLogin()) {
      this.$router.push("/home");
    }
  }
  @Watch("$route") async guide() {
    if (await testLogin()) {
      this.$router.push("/home");
    }
  }
  public async login() {
    const data = await login(this.user.identity, this.user.password);
    if (!data.success) {
      alert(data.error.message);
      return;
    }
    this.$router.push("/home");
  }
  public async cancelLogin() {
    await logout();
    this.$router.push("/");
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  min-height: 100%;
  background-color: var(--main-background);
  /* background-image: linear-gradient(23deg, #00b44e, #3cb165); */
}
.main {
  height: 100vh !important;
}
.title-container {
  height: calc(40% - 70px);
  display: flex;
  flex-direction: column;
  text-align: left;
  flex-direction: column;
  justify-content: center;
}

.title-container h1 {
  margin-bottom: 3px;
  font-size: 25px;
  line-height: 10px;
  color: var(--main-foreground);
}
.title-container h2 {
  font-weight: normal;
  font-size: 18px;
  line-height: 10px;
  color: var(--main-foreground);
}
.input-container {
  height: 60%;
  display: flex;
  flex-direction: column;
  text-align: left;
  flex-direction: column;
  justify-content: center;
}
.button-container {
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.screenwide-button {
  margin: 0 !important;
  width: calc(100vw - 20px);
}
</style>