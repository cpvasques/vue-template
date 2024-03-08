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
            :disabled="hasRequiredFields || isLoading"
            :is-loading="isLoading"
            :label="isLoading ? '' : 'Entrar'"
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
import { ref, computed, watch } from "vue";
import { useLogin } from "@/composables/useLogin";

import Card from "@/components/molecules/common/Card.vue";
import Header from "@/components/molecules/login/Header.vue";
import FormField from "@/components/molecules/common/FormField.vue";
import Button from "@/components/atoms/inputs/Button.vue";
import Checkbox from "@/components/atoms/inputs/Checkbox.vue";
import Footer from "@/components/molecules/login/Footer.vue";

export default {
  name: "LoginForm",
  components: {
    Card,
    Header,
    FormField,
    Button,
    Checkbox,
    Footer,
  },
  setup() {
    // DATA
    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const showRequiredFields = ref(false);
    const { doLogin, isLoading } = useLogin();

    // COMPUTED
    const hasRequiredFields = computed(() => !email.value || !password.value);

    // WATCHER
    watch([email, password], () => {
      showRequiredFields.value = false;
    });

    // METHODS
    const onSubmit = () => {
      if (hasRequiredFields.value) {
        showRequiredFields.value = true;
        return;
      }

      doLogin({
        email: email.value,
        password: password.value,
        stayConnected: rememberMe.value,
      });
    };

    return {
      email,
      password,
      rememberMe,
      onSubmit,
      showRequiredFields,
      hasRequiredFields,
      isLoading,
    };
  },
};
</script>
