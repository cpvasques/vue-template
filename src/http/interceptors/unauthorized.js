import router from "../../router";

export const unauthorized = (response) => {
  return response;
};

export const unauthorizedError = (error) => {
  if (error?.response?.status === 401) {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    router.push({ name: "Login" });
  }

  return Promise.reject(error);
};
