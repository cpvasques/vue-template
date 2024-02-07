<template>
  <form class="w-[80%] space-y-6 sm:w-[40%]" @submit.prevent="onSubmit">
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
        :disabled="hasRequiredFields"
        :is-loading="loginState.isLoading"
        :label="loginState.isLoading ? '' : 'Entrar'"
      />
    </div>
  </form>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useLogin } from "@/composables/useLogin";
import FormField from "@/components/molecules/FormField.vue";
import Button from "@/components/atoms/Button.vue";
import Checkbox from "@/components/atoms/Checkbox.vue";

export default {
  components: {
    FormField,
    Button,
    Checkbox,
  },
  setup() {
    // DATA
    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const showRequiredFields = ref(false);
    const { doLogin, isLoading, error } = useLogin();

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

    const loginState = {
      isLoading,
      error,
    };

    return {
      email,
      password,
      rememberMe,
      onSubmit,
      showRequiredFields,
      loginState,
      hasRequiredFields,
    };
  },
};
</script>
