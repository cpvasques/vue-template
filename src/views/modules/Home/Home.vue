<template>
  <div id="home">
    <h1>Home</h1>
  </div>
</template>

<script>
import isWebMixin from "@/mixins/isWebMixin";

export default {
  name: "Home",
  components: {},
  mixins: [isWebMixin],
  mounted() {},
};
</script>

<style lang="scss">
@import "Home.scss";
</style>
