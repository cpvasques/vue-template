import axios from "axios";
import { addBearer, addBearerError } from "./interceptors/addBearer";
import { unauthorized, unauthorizedError } from "./interceptors/unauthorized";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

axiosInstance.interceptors.request.use(addBearer, addBearerError);
axiosInstance.interceptors.response.use(unauthorized, unauthorizedError);

export default axiosInstance;
