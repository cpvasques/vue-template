import { defineStore } from "pinia";
import axiosInstance from "@/api/axios";

const defaultState = () => ({
  _token: localStorage.getItem("token") || null,
  _userInfo: {
    name: null,
    email: null,
  },
  _newPasswordToken: null,
  _isLoadingLogin: false,
});

export const useAuthStore = defineStore("authStore", {
  state: () => defaultState(),
  getters: {
    token: (state) => state._token,
    userInfo: (state) => state._userInfo,
    newPasswordToken: (state) => state._newPasswordToken,
    isLoadingLogin: (state) => state._isLoadingLogin,
  },
  actions: {
    cleanAuthInfo() {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      Object.assign(this.$state, defaultState());
    },
    loginRequest(body, stayConnected) {
      this.cleanAuthInfo();

      return new Promise(async (resolve, reject) => {
        try {
          this._isLoadingLogin = true;

          const response = await axiosInstance.post("auth/login", body);
          const { data } = response;
          const { token } = data;

          const JWTDecoded = this.decodeAccessToken(token);
          this._userInfo = JWTDecoded.user;

          const handleStorage = stayConnected ? localStorage : sessionStorage;
          handleStorage.setItem("token", token);

          resolve(response);
        } catch (error) {
          reject(error);
          throw error;
        } finally {
          this._isLoadingLogin = false;
        }
      });
    },
    decodeAccessToken(jwt) {
      const base64Url = jwt.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );

      return JSON.parse(jsonPayload);
    },
  },
  persist: true,
});
