<template>
  <div class="card">
    <div class="showed">
      <div class="left-part">
        <h4>{{ name }}</h4>
        <h2>${{ (price * owned).toFixed(2) }}</h2>
        <h4 class="percentage">@ ${{ price.toFixed(2) }}/股</h4>
        <h4
          v-if="profit !== 0"
          class="percentage"
          :class="{
            redForeground: profit > 0,
            greenForeground: profit < 0,
          }"
        >
          <i class="el-icon-circle-plus" v-if="profit > 0"></i>
          <i class="el-icon-remove" v-if="profit < 0"></i>
          ${{ displayTotalProfit }}
        </h4>
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
          <td>持有量:</td>
          <td>{{ owned }}</td>
        </tr>
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
        <tr>
          <td>解冻时间:</td>
          <td>{{ new Date(expires).toLocaleString() }}</td>
        </tr>
      </table>
      <el-tabs>
        <el-tab-pane label="新买入" v-if="unfreezed">
          <el-form
            class="buy-info-form"
            :model="buyInfo"
            :rules="rulesBuy"
            :ref="buyInfo"
          >
            <el-form-item label="新购入数量" prop="buyNumber">
              <el-input
                type="number"
                v-model="buyInfo.buyNumber"
                @input="modifyCost"
              ></el-input> </el-form-item
            ><el-form-item label="新购入金额" prop="buyCost">
              <el-input
                type="number"
                v-model="buyInfo.buyCost"
                @input="modifyNumber"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitBuy()"
                >新买入</el-button
              ></el-form-item
            >
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="卖出" v-if="unfreezed">
          <el-form :model="sellInfo" :rules="rulesSell" :ref="sellInfo">
            <el-form-item label="卖出数量" prop="sellNumber">
              <el-input
                type="number"
                v-model="sellInfo.sellNumber"
                @input="modifySellCost"
              ></el-input
              ><el-button @click="sellAll">全部卖出</el-button></el-form-item
            ><el-form-item label="卖出金额" prop="sellCost">
              <el-input
                type="number"
                v-model="sellInfo.sellCost"
                @input="modifySellNumber"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSell">
                卖出</el-button
              ></el-form-item
            >
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改期限">
          <el-form
            :model="modifyExpires"
            :ref="modifyExpires"
            :rules="rulesExpires"
          >
            <el-form-item label="解冻时间" prop="unfreezeTime">
              <el-date-picker
                v-model="modifyExpires.unfreezeTime"
                type="datetime"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitExpires()"
                >修改</el-button
              ></el-form-item
            >
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({})
export default class OwnedProduct extends Vue {
  @Prop() public recordId!: number;
  @Prop() public name!: string;
  @Prop() public price!: number;
  @Prop() public initialPrice!: number;
  @Prop() public percentage!: number;
  @Prop() public producer!: string;
  @Prop() public total!: number;
  @Prop() public owned!: number;
  @Prop() public remains!: number;
  @Prop() public category!: number;
  @Prop() public minimumHoldTime!: number;
  @Prop() public expires!: Date;
  get unfreezed() {
    return Date.now() > new Date(this.expires).getTime();
  }
  public buyInfo = {
    buyNumber: 0,
    buyCost: 0,
  };
  public sellInfo = {
    sellNumber: 0,
    sellCost: 0,
  };
  public modifyExpires = {
    unfreezeTime: this.expires,
  };
  public isEditing = false;
  public rulesBuy = {
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
  };
  public rulesSell = {
    sellNumber: [
      {
        required: true,
        message: "请输入数量",
        trigger: "blur",
      },
    ],
    sellCost: [
      {
        required: true,
        message: "请输入金额",
        trigger: "blur",
      },
    ],
  };
  public rulesExpires = {
    unfreezeTime: [
      {
        required: true,
        message: "请输入解冻时间",
        trigger: "blur",
      },
    ],
  };
  get profit() {
    return this.price * this.owned - this.initialPrice;
  }
  get displayTotalProfit() {
    if (this.profit >= 0) {
      return this.profit.toFixed(2);
    }
    return -this.profit.toFixed(2);
  }
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
  public modifySellNumber() {
    this.sellInfo.sellNumber = this.sellInfo.sellCost / this.price;
  }

  public modifySellCost() {
    this.sellInfo.sellCost = this.sellInfo.sellNumber * this.price;
  }
  public async submitBuy() {
    const { success, error } = (
      await axios.post("/api/product/number", {
        recordId: this.recordId,
        deltaNumber: this.buyInfo.buyNumber,
      })
    ).data;
    if (!success) {
      this.$alert(error.message, "新买入失败");
    } else {
      this.$alert("新买入成功", "提示");
      this.isEditing = false;
      this.$emit("needRefresh");
    }
  }
  public async submitSell() {
    const { success, error } = (
      await axios.post("/api/product/number", {
        recordId: this.recordId,
        deltaNumber: -this.sellInfo.sellNumber,
      })
    ).data;
    if (!success) {
      this.$alert(error.message, "卖出失败");
    } else {
      this.$alert("卖出成功", "提示");
      this.isEditing = false;
      this.$emit("needRefresh");
    }
  }
  public async submitExpires() {
    const { success, error } = (
      await axios.put("/api/product/expires", {
        recordId: this.recordId,
        expires: this.modifyExpires.unfreezeTime,
      })
    ).data;
    if (!success) {
      this.$alert(error.message, "修改期限失败");
    } else {
      this.$alert("修改成功", "提示");
      this.isEditing = false;
      this.$emit("needRefresh");
    }
  }
  public sellAll() {
    this.sellInfo.sellNumber = this.owned;
    this.modifySellCost();
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