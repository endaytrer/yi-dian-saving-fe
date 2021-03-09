<template>
  <transition name="el-fade-in">
    <el-col class="login" v-loading.fullscreen.lock="isLoading">
      <el-main class="main">
        <el-col class="title-container">
          <h1>修改密码</h1>
        </el-col>
        <el-col class="input-container">
          <el-form :model="user" :rules="rules"
            ><el-form-item label="旧密码" prop="oldPassword"
              ><el-input
                v-model="user.oldPassword"
                placeholder="不少于6个字符"
                show-password
                clearable
            /></el-form-item>
            <el-form-item label="新密码" prop="newPassword"
              ><el-input
                v-model="user.newPassword"
                placeholder="不少于6个字符"
                show-password
                clearable /></el-form-item
          ></el-form>
        </el-col>
        <el-col class="button-container">
          <el-button type="text" @click="cancelChange">取消</el-button>
          <el-button
            round
            width="100%"
            type="primary"
            class="screenwide-button"
            @click="change"
            >修改密码</el-button
          >
        </el-col>
      </el-main>
    </el-col>
  </transition>
</template>

<script lang="ts">
import { changePassword, testLogin } from "@/utils/Requests";
import { Component, Vue, Watch } from "vue-property-decorator";
@Component({})
export default class ChangePassword extends Vue {
  public isLoading = false;
  public user = {
    oldPassword: "",
    newPassword: "",
  };
  public rules = {
    oldPassword: [
      {
        required: true,
        message: "请输入旧密码",
        trigger: "blur",
      },
      {
        min: 6,
        message: "密码长度在6个字符及以上",
        trigger: "blur",
      },
    ],
    newPassword: [
      {
        required: true,
        message: "请输入新密码",
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
    if (!(await testLogin())) {
      this.$router.push("/");
    }
  }
  @Watch("$route") async guide() {
    if (!(await testLogin())) {
      this.$router.push("/");
    }
  }
  public async change() {
    this.isLoading = true;
    try {
      await changePassword(this.user.oldPassword, this.user.newPassword);
      this.$notify({ type: "success", message: "修改密码成功", title: "提示" });
      this.$router.push("/me");
    } catch (e) {
      this.$alert(e, "密码更换失败");
      return;
    } finally {
      this.isLoading = false;
    }
  }
  public cancelChange() {
    this.$router.push("/me");
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