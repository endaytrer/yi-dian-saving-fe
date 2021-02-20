<template>
  <el-col class="home"></el-col>
</template>

<script lang="ts">
import { testLogin } from "@/utils/Requests";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Home extends Vue {
  public sayHi() {
    alert("Hello World!");
  }
  async mounted() {
    if (!(await testLogin())) {
      this.$router.push("/");
    }
  }
}
</script>
<style scoped>
.home {
  width: 100%;
  min-height: 100%;
  background-color: var(--main-background);
}
</style>