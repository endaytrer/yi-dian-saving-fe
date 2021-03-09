<template>
  <transition name="el-fade-in">
    <el-col class="register" v-loading.fullscreen.lock="isLoading">
      <el-main class="main">
        <el-col class="title-container">
          <h1>亿点存钱</h1>
          <h2>年轻人的存钱平台</h2>
        </el-col>
        <el-col class="input-container">
          <el-form
            :model="user"
            :rules="rules"
            :label-position="'left'"
            size="small"
            status-icon
            ><el-form-item label="用户名" prop="username"
              ><el-input
                v-model="user.username"
                placeholder="不可重复"
                autocomplete="off"
            /></el-form-item>
            <el-form-item label="邮箱" prop="email"
              ><el-input
                v-model="user.email"
                placeholder="邮箱"
                autocomplete="off"
            /></el-form-item>
            <el-form-item label="生日" prop="birthday"
              ><el-date-picker
                v-model="user.birthday"
                placeholder="生日"
                autocomplete="off"
            /></el-form-item>
            <el-form-item label="密码" prop="password"
              ><el-input
                v-model="user.password"
                placeholder="不少于6个字符"
                autocomplete="off"
                show-password /></el-form-item
          ></el-form>
        </el-col>
        <el-col class="button-container">
          <el-button type="text" @click="cancelLogin">取消</el-button>
          <el-button
            round
            width="100%"
            type="primary"
            class="screenwide-button"
            @click="register"
            >注册</el-button
          >
        </el-col>
      </el-main>
    </el-col>
  </transition>
</template>

<script lang="ts">
import { register, testLogin } from "@/utils/Requests";
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Register extends Vue {
  public isLoading = false;
  public user = {
    username: "",
    email: "",
    birthday: new Date(),
    password: "",
  };
  public rules = {
    username: [
      {
        required: true,
        message: "请输入用户名",
        trigger: "blur",
      },
    ],
    email: [
      {
        required: true,
        message: "请输入邮箱",
        trigger: "blur",
      },
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: "blur",
      },
    ],
    birthday: [
      {
        required: true,
        message: "请输入生日",
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
  public async register() {
    this.isLoading = true;
    const data = await register(
      this.user.username,
      this.user.email,
      this.user.password,
      this.user.birthday
    );
    this.isLoading = false;
    if (!data.success) {
      this.$alert(data.error.message, "注册失败");
      return;
    }
    this.$router.push("/home");
  }
  public cancelLogin() {
    this.$router.push("/");
  }
}
</script>

<style scoped>
.register {
  width: 100%;
  min-height: 100%;
  background-color: var(--main-background);
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
  align-items: flex-start;
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