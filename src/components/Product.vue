<template>
  <div class="card">
    <div class="showed">
      <div class="left-part">
        <h4>{{ name }}</h4>
        <h2>${{ price.toFixed(2) }}<small>/股</small></h2>
      </div>
      <div class="right-part">
        <h3
          class="percentage"
          :class="{
            redForeground: percentage > 0,
            greenForeground: percentage < 0,
          }"
        >
          <i class="el-icon-top-right" v-if="percentage > 0"></i>
          <i class="el-icon-bottom-right" v-if="percentage < 0"></i>
          <i class="el-icon-right" v-if="percentage === 0"></i>
          {{ displayPercentage }}%
        </h3>
        <el-button
          class="add-button"
          :type="isEditing ? 'danger' : 'normal'"
          :icon="isEditing ? 'el-icon-close' : 'el-icon-plus'"
          @click="isEditing = !isEditing"
          circle
        ></el-button>
      </div>
    </div>
    <div v-if="isEditing" class="details">
      <table>
        <tr>
          <td>发行商:</td>
          <td>{{ producer }}</td>
        </tr>
        <tr>
          <td>发行数量:</td>
          <td>{{ total }}</td>
        </tr>
        <tr>
          <td>剩余数量:</td>
          <td>{{ remains }}</td>
        </tr>
        <tr>
          <td>级别:</td>
          <td>{{ category }}</td>
        </tr>
        <tr>
          <td>最小持有时间:</td>
          <td>{{ minimumHoldDuration }}</td>
        </tr>
      </table>
      <el-form
        class="buy-info-form"
        :rules="rules"
        :model="buyInfo"
        :ref="buyInfo"
      >
        <el-form-item label="购入数量" prop="buyNumber">
          <el-input
            type="number"
            v-model="buyInfo.buyNumber"
            @input="modifyCost"
          ></el-input> </el-form-item
        ><el-form-item label="购入金额" prop="buyCost">
          <el-input
            type="number"
            v-model="buyInfo.buyCost"
            @input="modifyNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="解冻时间" prop="unfreezeTime">
          <el-date-picker v-model="buyInfo.unfreezeTime" type="datetime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()"
            >买入</el-button
          ></el-form-item
        >
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({})
export default class Product extends Vue {
  @Prop() public productId!: number;
  @Prop() public name!: string;
  @Prop() public price!: number;
  @Prop() public percentage!: number;
  @Prop() public producer!: string;
  @Prop() public total!: number;
  @Prop() public remains!: number;
  @Prop() public category!: number;
  @Prop() public minimumHoldTime!: number;
  public buyInfo = {
    buyNumber: 0,
    buyCost: 0,
    unfreezeTime: new Date(Date.now() + this.minimumHoldTime + 86400000),
  };
  public isEditing = false;
  public rules = {
    buyNumber: [
      {
        required: true,
        message: "请输入数量",
        trigger: "blur",
      },
    ],
    buyCost: [
      {
        required: true,
        message: "请输入金额",
        trigger: "blur",
      },
    ],
    unfreezeTime: [
      {
        required: true,
        message: "请输入解冻时间",
        trigger: "blur",
      },
    ],
  };
  get displayPercentage() {
    if (this.percentage >= 0) {
      return this.percentage.toFixed(2);
    }
    return -this.percentage.toFixed(2);
  }
  get minimumHoldDuration() {
    return (this.minimumHoldTime / 604800000).toFixed(1) + "周";
  }
  public modifyNumber() {
    this.buyInfo.buyNumber = this.buyInfo.buyCost / this.price;
  }

  public modifyCost() {
    this.buyInfo.buyCost = this.buyInfo.buyNumber * this.price;
  }
  public async submitForm() {
    const { success, error } = (
      await axios.post("/api/product", {
        amount: this.buyInfo.buyNumber,
        expires: this.buyInfo.unfreezeTime,
        productId: this.productId,
      })
    ).data;
    if (!success) {
      this.$alert(error.message, "购买失败");
    } else {
      this.$alert("购买成功!", "提示");
      this.isEditing = false;
      this.$emit("needRefresh");
    }
  }
}
</script>
<style scoped>
.card {
  padding: 15px;
  margin: 20px 0;
  border-radius: 15px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: var(--main-background);
}
.card .showed {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.left-part {
  display: flex;
  flex-direction: column;
}
.card h4 {
  margin: 0;
  text-align: left;
}
.card h2 {
  margin: 0;
  font-size: 2em;
  text-align: left;
}
.card h2 small {
  font-size: 0.6em;
  color: var(--tertiary-foreground);
}
.percentage {
  font-size: 1.2em;
  color: var(--tertiary-foreground);
}
.redForeground {
  color: var(--up-foreground) !important;
}
.greenForeground {
  color: var(--down-foreground) !important;
}
.right-part {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.add-button {
  margin: 0 10px 0 10px;
}
.buy-info-form {
  margin: 20px 5px 0;
}
.details {
  margin: 10px 0 0;
  align-self: center;
  width: 100%;
}
.details table {
  width: 100%;
}
.details table tr {
  padding: 0;
  margin: 0;
}
.details table td {
  padding: 0;
  text-align: left;
  font-size: 0.9em;
}
</style>