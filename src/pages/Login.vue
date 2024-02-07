<template>
  <AuthTemplate>
    <LoginForm />
  </AuthTemplate>
</template>

<script>
import AuthTemplate from "@/components/templates/AuthTemplate.vue";
import LoginForm from "@/components/organisms/Login/LoginForm.vue";

export default {
  name: "Login",
  components: {
    AuthTemplate,
    LoginForm,
  },
};
</script>
