<template>
  <div class="home"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Finance extends Vue {
  public sayHi() {
    alert("Hello World!");
  }
}
</script>
