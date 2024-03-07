import axios from "axios";
import {
  handleBearerConfig,
  handleBearerError,
} from "./interceptors/handleBearer";
import {
  handleUnauthorizedResponse,
  handleUnauthorizedError,
} from "./interceptors/handleUnauthorized";
import { handleErrorResponse } from "./interceptors/handleError";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

// Interceptors de Request
axiosInstance.interceptors.request.use(handleBearerConfig, handleBearerError);

// Interceptors de Response
axiosInstance.interceptors.response.use(
  handleUnauthorizedResponse,
  handleUnauthorizedError,
);
axiosInstance.interceptors.response.use(null, handleErrorResponse);

export default axiosInstance;
