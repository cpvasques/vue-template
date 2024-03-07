import { useToast } from "vue-toastification";

export const handleErrorResponse = (error) => {
  const toast = useToast();

  if (error.response && error.response.data && error.response.data.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error("Ocorreu um erro. Por favor, tente novamente mais tarde.");
  }

  return Promise.reject(error);
};
