<template>
  <div id="app" :class="{ bright: theme === 'bright', dark: theme === 'dark' }">
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
  private theme = "bright";
  public logined = false;
  public setTheme(theme: string): void {
    this.theme = theme;
  }
  public async mounted() {
    this.logined = await testLogin();
  }
  @Watch("$route") public async guide() {
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
  font-family: "San Francisco", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--secondary-foreground);
  margin: 0;
  padding: 0;
}
</style>
