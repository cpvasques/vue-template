import Toast, { POSITION, useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 5000,
  showCloseButtonOnHover: true,
  hideProgressBar: true,
};

export default function useToastPlugin(app) {
  app.use(Toast, options);
  app.config.globalProperties.$toast = useToast();
}
