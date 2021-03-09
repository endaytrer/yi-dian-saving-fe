<template>
  <div id="app">
    <router-view />
    <NavigatorBar :selection="1" v-if="logined" />
  </div>
</template>
<script lang="ts">
import { testLogin } from "@/utils/Requests";
import NavigatorBar from "@/components/NavigatorBar.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
@Component({
  components: {
    NavigatorBar,
  },
})
export default class App extends Vue {
  public logined = false;
  public async created() {
    this.logined = await testLogin();
  }
  @Watch("$route") public async guide() {
    if (this.$route.path === "/changepwd") {
      this.logined = false;
      return;
    }
    this.logined = await testLogin();
  }
}
</script>
<style>
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "PingFang SC", "Microsoft YaHei", "Avenir Next", "Avenir",
    "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--secondary-foreground);
  background-color: var(--main-background);
  margin: 0;
  padding: 0 0 50px;
}
#app * {
  --color-primary: #04d960 !important;
  --navigator-color: #04d960;
  --highlighted-card: #cbf3d9;
  --main-background: #fdfdfd;
  --main-foreground: #0d0d0d;
  --contrast-foreground: #fdfdfd;
  --secondary-foreground: #048a3e;
  --tertiary-foreground: #aaaaaa;
  --up-foreground: #ff6060;
  --down-foreground: #46cd75;
}
</style>
