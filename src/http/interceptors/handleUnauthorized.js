import router from "../../router";

export const handleUnauthorizedResponse = (response) => {
  return response;
};

export const handleUnauthorizedError = (error) => {
  if (error?.response?.status === 401) {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    router.push({ name: "Login" });
  }

  return Promise.reject(error);
};
