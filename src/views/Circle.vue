<template>
  <el-main class="main">
    <h3>联系我们</h3>
    <el-card>
      <span
        ><el-button circle icon="el-icon-message"> </el-button>
        endaytrer@gmail.com</span
      >
      <br />
      <br />
      <span
        ><el-button circle icon="el-icon-message"> </el-button>
        endaytrer0120@stu.xjtu.edu.cn</span
      >
    </el-card>
  </el-main>
</template>
<script lang="ts">
import { testLogin } from "@/utils/Requests";
import { Vue, Component } from "vue-property-decorator";
@Component({})
export default class Circle extends Vue {
  async mounted() {
    if (!(await testLogin())) {
      this.$router.push("/");
    }
  }
}
</script>
<style>
.main {
  text-align: left;
}
</style>