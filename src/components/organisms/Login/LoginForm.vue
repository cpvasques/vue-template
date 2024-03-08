<template>
  <Card>
    <template #header>
      <Header />
    </template>
    <template #body>
      <form class="w-[100%] px-4 sm:px-[50px]" @submit.prevent="onSubmit">
        <FormField
          id="email"
          v-model="email"
          type="email"
          label="Email"
          placeholder="E-mail"
          :is-required="showRequiredFields"
        />
        <FormField
          id="password"
          v-model="password"
          type="password"
          label="Senha"
          placeholder="**************"
          is-password
          :is-required="showRequiredFields"
        />
        <div
          class="mt-4 flex flex-col-reverse items-center sm:flex-row sm:justify-between"
        >
          <Checkbox
            id="remember-me"
            v-model="rememberMe"
            class="mt-3 sm:mt-0"
            label="Lembrar-me"
          />
          <Button
            id="login-btn"
            type="submit"
            class="w-full sm:w-[83px]"
            :disabled="hasRequiredFields || isLoadingLogin"
            :is-loading="isLoadingLogin"
            :label="isLoadingLogin ? '' : 'Entrar'"
          />
        </div>
      </form>
    </template>
    <template #footer>
      <Footer />
    </template>
  </Card>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "@/stores/auth";

import Card from "@/components/molecules/common/Card.vue";
import Header from "@/components/molecules/login/Header.vue";
import FormField from "@/components/molecules/common/FormField.vue";
import Button from "@/components/atoms/inputs/Button.vue";
import Checkbox from "@/components/atoms/inputs/Checkbox.vue";
import Footer from "@/components/molecules/login/Footer.vue";

export default {
  components: {
    Card,
    Header,
    FormField,
    Button,
    Checkbox,
    Footer,
  },
  data: () => ({
    email: "",
    password: "",
    rememberMe: false,
    hasRequiredFields: false,
    showRequiredFields: false,
  }),
  computed: {
    ...mapState(useAuthStore, ["isLoadingLogin"]),
  },
  watch: {
    email() {
      this.showRequiredFields = false;
    },
    password() {
      this.showRequiredFields = false;
    },
  },
  methods: {
    ...mapActions(useAuthStore, ["loginRequest"]),
    onSubmit() {
      if (!this.email || !this.password) {
        this.showRequiredFields = true;
        return;
      }

      const body = {
        login: this.email,
        password: this.password,
      };

      this.loginRequest(body, this.rememberMe).then((res) => {
        const { status } = res;

        if (status === 201) {
          this.$router.push({
            name: "Home",
          });
        }
      });
    },
  },
};
</script>
