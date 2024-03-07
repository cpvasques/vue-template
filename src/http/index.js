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

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

// Interceptors de Request
http.interceptors.request.use(handleBearerConfig, handleBearerError);

// Interceptors de Response
http.interceptors.response.use(
  handleUnauthorizedResponse,
  handleUnauthorizedError,
);
http.interceptors.response.use(null, handleErrorResponse);

export default http;
