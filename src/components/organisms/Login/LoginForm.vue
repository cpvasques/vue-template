<template>
  <form class="space-y-6 w-[80%] sm:w-[40%]" @submit.prevent="onSubmit">
    <FormField
      id="email"
      v-model="email"
      type="email"
      label="Email"
      placeholder="Digite seu e-mail"
      :is-required="showRequiredFields"
    />
    <FormField
      id="password"
      v-model="password"
      type="password"
      label="Senha"
      placeholder="Digite sua senha"
      is-password
      :is-required="showRequiredFields"
    />
    <div class="flex items-center justify-between">
      <Checkbox id="remember-me" v-model="rememberMe" label="Lembrar-me" />
      <Button
        id="login-btn"
        type="submit"
        :disabled="hasRequiredFields || isLoading"
        :is-loading="isLoading"
        :label="isLoading ? '' : 'Entrar'"
      />
    </div>
  </form>
</template>

<script>
import FormField from "@/components/molecules/FormField.vue";
import Button from "@/components/atoms/Button.vue";
import Checkbox from "@/components/atoms/Checkbox.vue";

export default {
  components: {
    FormField,
    Button,
    Checkbox,
  },
  data: () => ({
    email: "",
    password: "",
    rememberMe: false,
    isLoading: false,
    hasRequiredFields: false,
    showRequiredFields: false,
  }),
  watch: {
    email() {
      this.showRequiredFields = false;
    },
    password() {
      this.showRequiredFields = false;
    },
  },
  methods: {
    onSubmit() {
      this.isLoading = true;

      if (!this.email || !this.password) {
        this.showRequiredFields = true;
        this.isLoading = false;
        return;
      }

      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
  },
};
</script>
