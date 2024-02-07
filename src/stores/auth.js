import { defineStore } from "pinia";

const defaultState = () => ({
  _token:
    localStorage.getItem("token") || sessionStorage.getItem("token") || null,
  _userInfo: JSON.parse(localStorage.getItem("userInfo")) || {
    name: null,
    email: null,
  },
});

export const useAuthStore = defineStore("authStore", {
  state: () => defaultState(),
  getters: {
    token: (state) => state._token,
    userInfo: (state) => state._userInfo,
  },
  actions: {
    setAuthInfo({ token, userInfo }) {
      this._token = token;
      this._userInfo = userInfo;
    },
    cleanAuthInfo() {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      this.$reset();
    },
  },
  persist: true,
});
