<template>
  <div class="header">
    <div v-if="!isWeb" class="header-logo">Logo</div>
    <div class="header-title">
      <h1 class="header-title__text">Seja bem-vindo.</h1>
      <h1 class="header-title__text">Acesse a sua conta.</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  components: {},
  props: {
    isWeb: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "Header.scss";
</style>
