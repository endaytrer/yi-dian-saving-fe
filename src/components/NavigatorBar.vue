<template>
  <div class="nav-bar">
    <router-link to="/home" class="nav-link"
      ><i class="el-icon-s-home"></i
      ><span class="nav-text">主页</span></router-link
    >
    <router-link to="/finance" class="nav-link"
      ><i class="el-icon-s-marketing"></i
      ><span class="nav-text">理财</span></router-link
    >
    <router-link to="/circle" class="nav-link"
      ><i class="el-icon-s-comment"></i
      ><span class="nav-text">社区</span></router-link
    >
    <router-link to="/me" class="nav-link">
      <i class="el-icon-user-solid"></i
      ><span class="nav-text">我</span></router-link
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class NavigatorBar extends Vue {}
</script>

<style scoped>
.nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: var(--secondary-foreground);
  background-color: var(--navigator-color);
}
.nav-bar .nav-link {
  width: 51px;
  height: 51px;
  border-radius: 50%;
  border: none;
  outline: none;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: color ease-out 0.2s;
}
.nav-bar .nav-link .nav-text {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
}
.nav-bar .router-link-active {
  color: var(--main-foreground) !important;
}
</style>