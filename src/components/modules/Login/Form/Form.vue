<template>
  <form
    id="login-form"
    class="form"
    novalidate
    autocomplete="off"
    @submit.prevent="handleLogin"
  >
    <fieldset class="form-fieldset">
      <GenericField
        id="email-no-fill"
        v-model="form.email"
        class="login-input"
        placeholder="E-mail"
        type="text"
        :error-message="emailErrorMessage"
        :show-error-message="!isEmailValid"
        :is-required="!isEmailValid"
      />
      <GenericField
        id="password-no-fill"
        v-model="form.password"
        class="login-input"
        placeholder="Senha"
        type="text"
        :error-message="passwordErrorMessage"
        :show-error-message="!isPasswordValid"
        :is-password="true"
        :is-required="!isPasswordValid"
      />
      <GenericCheckbox
        id="keep-on"
        v-model="stayConnected"
        label="Manter conectado"
      />
      <GenericButton
        id="login-btn"
        class="login-btn"
        label="Entrar"
        :is-loading="isLoadingLogin"
        :has-required-fields="!hasFilledFields"
      />
      <h5 class="form-fieldset__forgot" @click="handleForgot">
        Esqueci minha senha
      </h5>
    </fieldset>
  </form>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { validateEmail } from "@/utils/validators/validateEmail.js";

import GenericField from "@/components/shared/GenericField/GenericField.vue";
import GenericCheckbox from "@/components/shared/GenericCheckbox/GenericCheckbox.vue";
import GenericButton from "@/components/shared/GenericButton/GenericButton.vue";

export default {
  name: "Form",
  components: { GenericField, GenericCheckbox, GenericButton },
  data: () => ({
    // handling form
    form: {
      email: null,
      password: null,
    },

    //handling validations
    stayConnected: false,
    isEmailValid: true,
    isPasswordValid: true,

    //handling error
    emailErrorMessage: null,
    passwordErrorMessage: null,
  }),
  computed: {
    ...mapState(useAuthStore, ["isLoadingLogin"]),
    hasFilledFields() {
      const { email, password } = this.form;

      return !!email && !!password;
    },
  },
  watch: {
    "form.email"() {
      this.isEmailValid = true;
    },
    "form.password"() {
      this.isPasswordValid = true;
    },
  },
  methods: {
    ...mapActions(useAuthStore, ["loginRequest"]),
    handleForgot() {
      this.$router.push({ name: "ForgotPassword" });
    },
    async handleLogin(event) {
      const { email, password } = this.form;

      if (this.isLoadingLogin) {
        event.preventDefault();
        return;
      }

      this.clearValidations();
      this.isEmailValid = validateEmail(email);

      if (!this.isEmailValid)
        return (this.emailErrorMessage = "E-mail inválido.");

      if (!password) {
        this.passwordErrorMessage = "Senha inválida.";
        this.isPasswordValid = false;
        return;
      }

      this.loginRequest(this.form, this.stayConnected)
        .then((res) => {
          const { status } = res;

          if (status === 201) {
            this.$router.push({ name: "Home" });
          }
        })
        .catch(() => {
          const message = "E-mail ou senha incorretos";

          this.isPasswordValid = false;
          this.passwordErrorMessage = message;
        });
    },
    clearValidations() {
      this.isEmailValid = true;
      this.isPasswordValid = true;

      this.emailErrorMessage = null;
      this.passwordErrorMessage = null;
    },
  },
};
</script>

<style lang="scss">
@import "Form.scss";
</style>
