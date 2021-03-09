<template>
  <el-col class="abstract" v-loading="isLoading">
    <transition name="el-fade-in"
      ><div v-if="toggleSave === false" class="normal-panel">
        <el-col class="left-panel" :span="15">
          <h4>今天你存了:</h4>
          <h2>{{ moneySign + todayMoney.toFixed(2) }}</h2>
          <table class="info-table">
            <tr>
              <td>存款余额</td>
              <td>{{ moneySign + balance.toFixed(2) }}</td>
            </tr>
            <tr>
              <td>坚持存款</td>
              <td>{{ continuous }}天</td>
            </tr>
          </table>
        </el-col>

        <button id="save-button" @click="toggleSide">{{ moneySign }}</button>
      </div>
      <div v-if="toggleSave === true" class="save-panel">
        <h4>你将存款:</h4>
        <h1>{{ moneySign + amount.toFixed(2) }}</h1>
        <el-slider
          v-model="amount"
          class="amount-slider"
          :max="1000"
          show-input
        ></el-slider>
        <el-row>
          <el-button round @click="toggleSide">取消</el-button>
          <el-button type="primary" @click="save" round :enabled="!!amount"
            >确定</el-button
          >
        </el-row>
      </div></transition
    >
  </el-col>
</template>
<script lang="ts">
import { getUserInfo, saveMoney } from "@/utils/Requests";
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({})
export default class Abstract extends Vue {
  @Prop() moneySign = "¥";
  isLoading = true;
  todayMoney = 0;
  target = 0;
  balance = 0;
  continuous = 0;
  amount = 0;
  toggleSave = false;
  toggleSide() {
    this.toggleSave = !this.toggleSave;
  }
  async updateUserInfo() {
    this.isLoading = true;
    const userInfo = await getUserInfo();
    this.todayMoney = Number.parseFloat(userInfo.savedToday);
    this.balance = Number.parseFloat(userInfo.balance);
    this.continuous = Number.parseInt(userInfo.continuous);
    this.target = Number.parseFloat(userInfo.target);
    this.isLoading = false;
  }
  async mounted() {
    this.updateUserInfo();
  }
  async save() {
    this.isLoading = true;
    try {
      await saveMoney(this.amount);
      const userInfo = await getUserInfo();
      this.todayMoney = Number.parseFloat(userInfo.savedToday);
      this.balance = Number.parseFloat(userInfo.balance);
      this.continuous = Number.parseInt(userInfo.continuous);
      this.$notify({ type: "success", message: "存钱成功", title: "提示" });
      this.$emit("needRefresh");
      this.toggleSide();
    } catch (e) {
      this.$alert(e, "存钱失败");
    } finally {
      this.isLoading = false;
    }
  }
}
</script>
<style scoped>
.abstract {
  margin-bottom: 20px;
  padding: 20px;
  position: relative;
  height: 100%;
  border-radius: 15px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.06),
    -8px -8px 16px rgba(255, 255, 255, 0.94);
  background-color: var(--highlighted-card);
}
.left-panel {
  padding: 10px 0 15px;
  text-align: left;
}
.left-panel h4 {
  margin: 0;
}
.left-panel h2 {
  margin: 0 0 20px;
  font-size: 2em;
}
.left-panel .info-table {
  width: 100%;
  font-size: 0.9em;
  margin: 3px 0 3px;
  color: var(--secondary-foreground);
}
.left-panel .info-table tr td:nth-child(1) {
  width: 60px;
  padding-right: 20px;
}
.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
}
#save-button {
  cursor: pointer;
  position: absolute;
  right: 15px;
  bottom: 15px;
  width: 70px;
  height: 70px;
  font-size: 50px;
  border-radius: 35px;
  padding: 0;
  border: none;
  outline: none;
  background-color: var(--color-primary);
  color: var(--contrast-foreground);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
}
.save-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.save-panel h4 {
  align-self: baseline;
  margin: 0;
}
.save-panel h1 {
  margin: 50px 0 40px;
  font-size: 3em;
}
.amount-slider {
  width: 100%;
  margin-bottom: 20px;
}
.progress {
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>