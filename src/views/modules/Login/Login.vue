<template>
  <div id="login" class="login">
    <div class="login-container">
      <Header :is-web="isWeb" />
      <Form />
    </div>
  </div>
</template>

<script>
import Header from "@/components/modules/Login/Header/Header.vue";
import Form from "@/components/modules/Login/Form/Form.vue";
import isWebMixin from "@/mixins/isWebMixin";

export default {
  name: "Login",
  components: { Header, Form },
  mixins: [isWebMixin],
  mounted() {},
};
</script>

<style lang="scss">
@import "Login.scss";
</style>
