import { ref } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { login } from "@/services/loginService";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

export function useLogin() {
  const isLoading = ref(false);
  const error = ref(null);
  const authStore = useAuthStore();

  //JWT DECODE
  const decodeAccessToken = (jwt) => {
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
  };

  // LOGIN REQUEST
  const { mutate } = useMutation({
    mutationFn: login,
    onMutate: () => {
      isLoading.value = true;
      error.value = null;
    },
    onSuccess: (data, variables) => {
      if (variables.stayConnected) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      const userInfo = decodeAccessToken(data.token);
      authStore.setAuthInfo({ token: data.token, userInfo });
      router.push({ name: "Home" });
    },
    onError: (err) => {
      error.value = err;
    },
    onSettled: () => {
      isLoading.value = false;
    },
  });

  const doLogin = ({ email, password, stayConnected }) => {
    mutate({ email, password, stayConnected });
  };

  return { doLogin, isLoading, error };
}
