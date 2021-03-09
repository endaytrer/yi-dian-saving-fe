<template>
  <el-main v-loading.fullscreen.lock="isLoadingFullscreen">
    <el-row :gutter="20" v-loading="isLoading">
      <el-col :span="12">
        <el-card class="card display-card">
          <h5>今日存款</h5>
          <h2>{{ moneySign + today.toFixed(2) }}</h2></el-card
        >
        <el-card class="card display-card">
          <h5>存款进度</h5>
          <el-progress
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
            :width="90"
            :percentage="displayPercentage"
            type="circle"
          ></el-progress
        ></el-card>
      </el-col>
      <el-col :span="12"
        ><el-card class="card display-card">
          <h5>存款余额</h5>
          <h2>{{ moneySign + total.toFixed(2) }}</h2>
        </el-card>
        <el-card class="card display-card">
          <h5>已坚持天数</h5>
          <h2>{{ continuous }}天</h2></el-card
        ></el-col
      >
    </el-row>
    <el-card class="card" v-loading="isLoading">
      <h5>修改计划</h5>
      <button
        v-if="!isEditable"
        @click="isEditable = !isEditable"
        class="invisible-button"
      >
        {{ moneySign + target.toFixed(2) }}
      </button>
      <el-input
        type="number"
        v-if="isEditable"
        class="input"
        v-model="tempTarget"
        @blur="submitChange"
      ></el-input
    ></el-card>
    <div class="buttons">
      <el-button
        class="logout"
        plain
        round
        @click="isWithdrawing = !isWithdrawing"
        v-if="total"
        >取出存款</el-button
      >
      <el-button class="logout" plain round @click="changepwd"
        >修改密码</el-button
      >
      <el-button class="logout" type="danger" plain round @click="logout"
        >退出登录</el-button
      >
    </div>
    <el-dialog :fullscreen="true" title="取出存款" :visible.sync="isWithdrawing"
      ><el-form inline>
        <el-form-item label="取出数额">
          <el-input type="number" v-model="withdrawAmount" :max="total"
        /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="withdraw">取出</el-button
          ><el-button @click="withdrawAll">全部取出</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-main>
</template>
<script lang="ts">
import { getUserInfo, logout, testLogin } from "@/utils/Requests";
import { Vue, Component } from "vue-property-decorator";
import axios from "axios";
interface ThemeSettable extends Vue {
  setTheme(theme: string): void;
}
@Component({})
export default class Me extends Vue {
  public isLoading = true;
  public isLoadingFullscreen = false;
  public moneySign = "¥";
  public total = 0;
  public continuous = 0;
  public today = 0;
  public target = 0;
  public tempTarget = 0;
  public withdrawAmount = 0;
  public isEditable = false;
  public isWithdrawing = false;

  async mounted() {
    if (!(await testLogin())) {
      this.$router.push("/");
    }
  }
  public get displayPercentage() {
    if (this.target === 0 && this.total === 0) {
      return 0;
    }
    if (this.target === 0) {
      return 100;
    }
    if (this.total / this.target > 1) {
      return 100;
    }
    return Number.parseFloat(((this.total / this.target) * 100).toFixed(2));
  }

  public async logout() {
    this.isLoadingFullscreen = true;
    await logout();
    this.$router.push("/");
  }
  public async getInfo() {
    this.isLoading = true;
    const user = await getUserInfo();
    this.total = user.balance;
    this.target = user.target || 0;
    this.tempTarget = this.target;
    this.continuous = user.continuous;
    this.today = user.savedToday;
    this.isLoading = false;
  }
  public created() {
    this.getInfo();
  }
  public async submitChange() {
    this.isLoadingFullscreen = true;
    const { data } = await axios.put("/api/target", {
      changeTo: this.tempTarget,
    });
    if (!data.success) {
      this.$alert(data.error.message, "修改计划失败");
      this.isLoadingFullscreen = false;
    } else {
      this.getInfo();
      this.isEditable = !this.isEditable;
      this.isLoadingFullscreen = false;
    }
  }
  public async withdraw() {
    this.isLoadingFullscreen = true;
    const { success, error } = (
      await axios.post("/api/withdraw", {
        amount: this.withdrawAmount,
      })
    ).data;
    if (!success) {
      this.$alert(error.message, "取款失败");
      this.isLoadingFullscreen = false;
    } else {
      this.isWithdrawing = false;
      this.getInfo();
      this.$notify({ message: "取款成功", title: "提示", type: "success" });
      this.isLoadingFullscreen = false;
    }
  }
  public changepwd() {
    this.$router.push("/changepwd");
  }
  public async withdrawAll() {
    this.isLoadingFullscreen = true;
    const { success, error } = (
      await axios.post("/api/withdraw", {
        amount: this.total,
      })
    ).data;
    if (!success) {
      this.$alert(error.message, "取款失败");
      this.isLoadingFullscreen = false;
    } else {
      this.isWithdrawing = false;
      this.getInfo();
      this.$notify({ message: "取款成功", title: "提示", type: "success" });
      this.isLoadingFullscreen = false;
    }
  }
}
</script>
<style scoped>
.card {
  border-radius: 15px;

  margin: 20px 0 20px;
  position: relative;
}
.display-card {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card h5 {
  position: absolute;
  top: 10px;
  color: var(--tertiary-foreground);
  margin: 0;
  text-align: left;
}
.display-card .progress {
  margin-top: 20px;
}
.display-card h2 {
  font-size: 1.4em;
  width: 100%;
}
.logout {
  margin: 20px 0 0;
  width: 100%;
}
.input {
  margin: 20px 0 10px;
}
.buttons {
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.invisible-button {
  margin: 20px 0 10px;
  font-family: inherit;
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: 1.4em;
  font-weight: bold;
}
</style>