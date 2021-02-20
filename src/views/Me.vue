<template>
  <el-container>
    <el-col>
      <el-button type="danger" plain round @click="logout">注销</el-button>
    </el-col>
  </el-container>
</template>
<script lang="ts">
import { logout } from "@/utils/Requests";
import { Vue, Component } from "vue-property-decorator";
@Component({})
export default class Me extends Vue {
  public async logout() {
    await logout();
    this.$router.push("/");
  }
}
</script>